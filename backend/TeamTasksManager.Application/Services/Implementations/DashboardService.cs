using Microsoft.EntityFrameworkCore;
using TeamTasksManager.Application.DTOs.Dashboard;
using TeamTasksManager.Application.Services.Interfaces;
using TeamTasksManager.Domain.Enums;
using TeamTasksManager.Infrastructure.Data.Context;

namespace TeamTasksManager.Infrastructure.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly ApplicationDbContext _context;

        public DashboardService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DeveloperWorkloadDto>> GetDeveloperWorkloadAsync()
        {
            return await _context.Developers
                .Where(d => d.IsActive)
                .Select(d => new DeveloperWorkloadDto
                {
                    DeveloperName = d.FirstName + " " + d.LastName,
                    OpenTasksCount = d.Tasks.Count(t => t.Status != TaskItemStatus.Completed),
                    AverageEstimatedComplexity = d.Tasks
                        .Where(t => t.Status != TaskItemStatus.Completed && t.EstimatedComplexity.HasValue)
                        .Average(t => (decimal?)t.EstimatedComplexity) ?? 0
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<ProjectHealthDto>> GetProjectHealthAsync()
        {
            return await _context.Projects
                .Select(p => new ProjectHealthDto
                {
                    ProjectName = p.Name,
                    TotalTasks = p.Tasks.Count,
                    OpenTasks = p.Tasks.Count(t => t.Status != TaskItemStatus.Completed),
                    CompletedTasks = p.Tasks.Count(t => t.Status == TaskItemStatus.Completed)
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<DeveloperDelayRiskDto>> GetDeveloperDelayRiskAsync()
        {
            var sql = @"
                WITH developer_stats AS (
                    SELECT 
                        d.developer_id,
                        d.first_name || ' ' || d.last_name AS developer_name,
                        COUNT(t.task_id) FILTER (WHERE t.status <> 'Completed') AS open_tasks_count,
                        COALESCE(AVG(
                            CASE 
                                WHEN t.completion_date > t.due_date THEN t.completion_date - t.due_date 
                                ELSE 0 
                            END
                        ) FILTER (WHERE t.status = 'Completed'), 0) AS avg_delay_days,
                        MIN(t.due_date) FILTER (WHERE t.status <> 'Completed') AS nearest_due_date,
                        MAX(t.due_date) FILTER (WHERE t.status <> 'Completed') AS latest_due_date
                    FROM core.developers d
                    LEFT JOIN core.tasks t ON d.developer_id = t.assignee_id
                    WHERE d.is_active = TRUE
                    GROUP BY d.developer_id, d.first_name, d.last_name
                )
                SELECT 
                    developer_name AS DeveloperName,
                    open_tasks_count AS OpenTasksCount,
                    ROUND(avg_delay_days::numeric, 1) AS AvgDelayDays,
                    nearest_due_date AS NearestDueDate,
                    latest_due_date AS LatestDueDate,
                    (latest_due_date + (avg_delay_days * INTERVAL '1 day'))::DATE AS PredictedCompletionDate,
                    CASE 
                        WHEN (latest_due_date + (avg_delay_days * INTERVAL '1 day')) > latest_due_date 
                             OR avg_delay_days >= 3 THEN 1 
                        ELSE 0 
                    END AS HighRiskFlag
                FROM developer_stats";

            return await _context.Database
                .SqlQueryRaw<DeveloperDelayRiskDto>(sql)
                .ToListAsync();
        }
    }
}
