using TeamTasksManager.Application.DTOs.Common;
using TeamTasksManager.Application.DTOs.Task;

namespace TeamTasksManager.Application.Services.Interfaces
{
    public interface ITaskService<T> where T : class
    {
        Task<PagedResultDto<T>> GetPagedTasksByProjectAsync(
            int projectId,
            int page,
            int pageSize,
            string? status = null,
            int? assigneeId = null);

        Task<T> CreateTaskAsync(CreateTaskDto createTaskDto);
        Task<T> UpdateTaskStatusAsync(int taskId, UpdateTaskStatusDto updateDto);
    }
}
