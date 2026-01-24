using Microsoft.AspNetCore.Mvc;
using TeamTasksManager.API.Common;
using TeamTasksManager.Application.DTOs.Common;
using TeamTasksManager.Application.DTOs.Project;
using TeamTasksManager.Application.DTOs.Task;
using TeamTasksManager.Application.Services.Interfaces;

namespace TeamTasksManager.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly ITaskService _taskService;

        public ProjectsController(IProjectService projectService, ITaskService taskService)
        {
            _projectService = projectService;
            _taskService = taskService;
        }

        /// <summary>
        /// Obtiene todos los proyectos con estadísticas de tareas
        /// </summary>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ApiResponse<IEnumerable<ProjectDto>>>> GetAllProjects()
        {
            var projects = await _projectService.GetAllProjectsWithStatsAsync();

            return Ok(ApiResponse<IEnumerable<ProjectDto>>
                .SuccessResponse(projects));
        }

        /// <summary>
        /// Obtiene un proyecto por ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiResponse<ProjectDto>>> GetProjectById(int id)
        {
            var project = await _projectService.GetProjectByIdAsync(id);

            if (project == null)
            {
                return NotFound(ApiResponse<ProjectDto>
                    .ErrorResponse($"Project with ID {id} not found"));
            }

            return Ok(ApiResponse<ProjectDto>
                .SuccessResponse(project));
        }

        /// <summary>
        /// Obtiene las tareas de un proyecto con filtros y paginación
        /// </summary>
        [HttpGet("{id}/tasks")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ApiResponse<PagedResultDto<TaskDto>>>> GetProjectTasks(
            int id,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? status = null,
            [FromQuery] int? assigneeId = null)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 100) pageSize = 100;

            var result = await _taskService.GetPagedTasksByProjectAsync(
                id, page, pageSize, status, assigneeId);

            return Ok(ApiResponse<PagedResultDto<TaskDto>>
                .SuccessResponse(result));
        }
    }
}
