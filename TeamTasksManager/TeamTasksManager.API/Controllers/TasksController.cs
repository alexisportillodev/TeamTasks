using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TeamTasksManager.API.Common;
using TeamTasksManager.Application.DTOs.Task;
using TeamTasksManager.Application.Services.Interfaces;

namespace TeamTasksManager.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;
        private readonly IValidator<CreateTaskDto> _createTaskValidator;
        private readonly IValidator<UpdateTaskStatusDto> _updateTaskValidator;

        public TasksController(
            ITaskService taskService,
            IValidator<CreateTaskDto> createTaskValidator,
            IValidator<UpdateTaskStatusDto> updateTaskValidator)
        {
            _taskService = taskService;
            _createTaskValidator = createTaskValidator;
            _updateTaskValidator = updateTaskValidator;
        }

        /// <summary>
        /// Crea una nueva tarea
        /// </summary>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ApiResponse<TaskDto>>> CreateTask(
            [FromBody] CreateTaskDto createTaskDto)
        {
            var validationResult = await _createTaskValidator.ValidateAsync(createTaskDto);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(ApiResponse<TaskDto>
                    .ErrorResponse("Validation failed", errors));
            }

            try
            {
                var task = await _taskService.CreateTaskAsync(createTaskDto);

                return CreatedAtAction(
                    nameof(GetTaskById),
                    new { id = task.TaskId },
                    ApiResponse<TaskDto>
                        .SuccessResponse(task, "Task created successfully"));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<TaskDto>
                    .ErrorResponse(ex.Message));
            }
        }

        /// <summary>
        /// Obtiene una tarea por ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiResponse<TaskDto>>> GetTaskById(int id)
        {
            var task = await _taskService.GetTaskByIdAsync(id);

            if (task == null)
            {
                return NotFound(ApiResponse<TaskDto>
                    .ErrorResponse($"Task with ID {id} not found"));
            }

            return Ok(ApiResponse<TaskDto>
                .SuccessResponse(task));
        }

        /// <summary>
        /// Actualiza el estado de una tarea
        /// </summary>
        [HttpPut("{id}/status")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiResponse<TaskDto>>> UpdateTaskStatus(
            int id,
            [FromBody] UpdateTaskStatusDto updateDto)
        {
            var validationResult = await _updateTaskValidator.ValidateAsync(updateDto);
            if (!validationResult.IsValid)
            {
                var errors = validationResult.Errors
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(ApiResponse<TaskDto>
                    .ErrorResponse("Validation failed", errors));
            }

            try
            {
                var task = await _taskService.UpdateTaskStatusAsync(id, updateDto);

                if (task == null)
                {
                    return NotFound(ApiResponse<TaskDto>
                        .ErrorResponse($"Task with ID {id} not found"));
                }

                return Ok(ApiResponse<TaskDto>
                    .SuccessResponse(task, "Task status updated successfully"));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<TaskDto>
                    .ErrorResponse(ex.Message));
            }
        }
    }
}
