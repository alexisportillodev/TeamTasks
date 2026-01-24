using AutoMapper;
using TeamTasksManager.Application.DTOs.Common;
using TeamTasksManager.Application.DTOs.Task;
using TeamTasksManager.Application.Services.Interfaces;
using TeamTasksManager.Domain.Entities;
using TeamTasksManager.Domain.Enums;
using TeamTasksManager.Domain.Interfaces;

namespace TeamTasksManager.Application.Services.Implementations
{
    public class TaskService : ITaskService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public TaskService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PagedResultDto<TaskDto>> GetPagedTasksByProjectAsync(
            int projectId,
            int page,
            int pageSize,
            string? status = null,
            int? assigneeId = null)
        {
            TaskItemStatus? taskStatus = null;

            if (!string.IsNullOrWhiteSpace(status) &&
                Enum.TryParse<TaskItemStatus>(status, true, out var parsedStatus))
            {
                taskStatus = parsedStatus;
            }

            var (tasks, totalCount) =
                await _unitOfWork.Tasks.GetPagedTasksByProjectAsync(
                    projectId, page, pageSize, taskStatus, assigneeId);

            return new PagedResultDto<TaskDto>
            {
                Items = _mapper.Map<IEnumerable<TaskDto>>(tasks),
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<TaskDto> CreateTaskAsync(CreateTaskDto createTaskDto)
        {
            if (!await _unitOfWork.Projects.ExistsAsync(p => p.ProjectId == createTaskDto.ProjectId))
                throw new ArgumentException("El proyecto no existe");

            if (createTaskDto.AssigneeId.HasValue &&
                !await _unitOfWork.Developers.ExistsAsync(d => d.DeveloperId == createTaskDto.AssigneeId))
                throw new ArgumentException("El desarrollador no existe");

            var taskItem = _mapper.Map<TaskItem>(createTaskDto);

            await _unitOfWork.Tasks.AddAsync(taskItem);
            await _unitOfWork.SaveChangesAsync();

            var createdTask = await _unitOfWork.Tasks.GetByIdWithDetailsAsync(taskItem.TaskId);

            return _mapper.Map<TaskDto>(createdTask);
        }

        public async Task<TaskDto?> UpdateTaskStatusAsync(int taskId, UpdateTaskStatusDto updateDto)
        {
            var task = await _unitOfWork.Tasks.GetByIdAsync(taskId);
            if (task == null) return null;

            if (!Enum.TryParse<TaskItemStatus>(updateDto.Status, true, out var status))
                throw new ArgumentException("Estado inválido");

            task.Status = status;

            if (!string.IsNullOrWhiteSpace(updateDto.Priority))
            {
                if (!Enum.TryParse<TaskPriority>(updateDto.Priority, true, out var priority))
                    throw new ArgumentException("Prioridad inválida");

                task.Priority = priority;
            }

            if (updateDto.EstimatedComplexity.HasValue)
                task.EstimatedComplexity = updateDto.EstimatedComplexity.Value;

            if (task.Status == TaskItemStatus.Completed && !task.CompletionDate.HasValue)
                task.CompletionDate = DateTime.UtcNow;

            await _unitOfWork.Tasks.UpdateAsync(task);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<TaskDto>(task);
        }

        public async Task<TaskDto> GetTaskByIdAsync(int id)
        {
            var task = await _unitOfWork.Tasks.GetByIdWithDetailsAsync(id);

            if (task == null)
                return null;

            return _mapper.Map<TaskDto>(task);
        }

    }
}
