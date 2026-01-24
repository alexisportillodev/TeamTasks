using Microsoft.EntityFrameworkCore;
using TeamTasksManager.Domain.Entities;
using TeamTasksManager.Domain.Enums;
using TeamTasksManager.Domain.Interfaces.Repositories;
using TeamTasksManager.Infrastructure.Data.Context;

namespace TeamTasksManager.Infrastructure.Data.Repositories
{
    public class TaskRepository : GenericRepository<TaskItem>, ITaskRepository
    {
        public TaskRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<TaskItem>> GetTasksByProjectIdAsync(int projectId)
        {
            return await _dbSet
                .Where(t => t.ProjectId == projectId)
                .Include(t => t.Assignee)
                .Include(t => t.Project)
                .OrderBy(t => t.DueDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<TaskItem>> GetTasksByDeveloperIdAsync(int developerId)
        {
            return await _dbSet
                .Where(t => t.AssigneeId == developerId)
                .Include(t => t.Project)
                .OrderBy(t => t.DueDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<TaskItem>> GetTasksByStatusAsync(TaskItemStatus status)
        {
            return await _dbSet
                .Where(t => t.Status == status)
                .Include(t => t.Assignee)
                .Include(t => t.Project)
                .ToListAsync();
        }

        public async Task<IEnumerable<TaskItem>> GetTasksDueSoonAsync(int days = 7)
        {
            var endDate = DateTime.UtcNow.AddDays(days);

            return await _dbSet
                .Where(t => t.Status != TaskItemStatus.Completed
                         && t.DueDate >= DateTime.UtcNow
                         && t.DueDate <= endDate)
                .Include(t => t.Assignee)
                .Include(t => t.Project)
                .OrderBy(t => t.DueDate)
                .ToListAsync();
        }

        public async Task<(IEnumerable<TaskItem> Tasks, int TotalCount)> GetPagedTasksByProjectAsync(
            int projectId,
            int page,
            int pageSize,
            TaskItemStatus? status = null,
            int? assigneeId = null)
        {
            var query = _dbSet
                .Where(t => t.ProjectId == projectId);

            if (status.HasValue)
            {
                query = query.Where(t => t.Status == status.Value);
            }

            if (assigneeId.HasValue)
            {
                query = query.Where(t => t.AssigneeId == assigneeId.Value);
            }

            var totalCount = await query.CountAsync();

            var tasks = await query
                .Include(t => t.Assignee)
                .OrderBy(t => t.DueDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (tasks, totalCount);
        }

        public async Task<TaskItem?> GetByIdWithDetailsAsync(int taskId)
        {
            return await _dbSet
                .Include(t => t.Project)
                .Include(t => t.Assignee)
                .FirstOrDefaultAsync(t => t.TaskId == taskId);
        }

    }
}
