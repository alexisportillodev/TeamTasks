using TeamTasksManager.Application.DTOs.Common;
using TeamTasksManager.Application.DTOs.Task;

namespace TeamTasksManager.Application.Services.Interfaces
{
    public interface ITaskService
    {
        Task<PagedResultDto<TaskDto>> GetPagedTasksByProjectAsync(
            int projectId,
            int page,
            int pageSize,
            string? status = null,
            int? assigneeId = null);

        Task<TaskDto> CreateTaskAsync(CreateTaskDto createTaskDto);
        Task<TaskDto?> UpdateTaskStatusAsync(int taskId, UpdateTaskStatusDto updateDto);
        Task<TaskDto> GetTaskByIdAsync(int id);
    }
}
