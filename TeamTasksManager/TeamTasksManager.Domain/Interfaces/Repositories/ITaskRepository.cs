using TeamTasksManager.Domain.Entities;
using TeamTasksManager.Domain.Enums;

namespace TeamTasksManager.Domain.Interfaces.Repositories
{
    public interface ITaskRepository : IGenericRepository<TaskItem>
    {
        Task<IEnumerable<TaskItem>> GetTasksByProjectIdAsync(int projectId);
        Task<IEnumerable<TaskItem>> GetTasksByDeveloperIdAsync(int developerId);
        Task<IEnumerable<TaskItem>> GetTasksByStatusAsync(TaskItemStatus status);
        Task<IEnumerable<TaskItem>> GetTasksDueSoonAsync(int days = 7);
        Task<(IEnumerable<TaskItem> Tasks, int TotalCount)> GetPagedTasksByProjectAsync(
            int projectId,
            int page,
            int pageSize,
            TaskItemStatus? status = null,
            int? assigneeId = null
        );
    }
}
