using Microsoft.AspNetCore.Mvc;
using TeamTasksManager.API.Common;
using TeamTasksManager.Application.DTOs.Dashboard;
using TeamTasksManager.Application.DTOs.Common;
using TeamTasksManager.Application.Services.Interfaces;

namespace TeamTasksManager.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        /// <summary>
        /// Obtiene el resumen de carga de trabajo por desarrollador (con paginación)
        /// </summary>
        [HttpGet("developer-workload")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<PagedResultDto<DeveloperWorkloadDto>>>> GetDeveloperWorkload(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 100) pageSize = 100;

            var result = await _dashboardService.GetDeveloperWorkloadAsync(page, pageSize);
            return Ok(ApiResponse<PagedResultDto<DeveloperWorkloadDto>>.SuccessResponse(result, "Developer workload retrieved successfully"));
        }

        /// <summary>
        /// Obtiene el resumen de estado de salud por proyecto (con paginación)
        /// </summary>
        [HttpGet("project-health")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<PagedResultDto<ProjectHealthDto>>>> GetProjectHealth(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 100) pageSize = 100;

            var result = await _dashboardService.GetProjectHealthAsync(page, pageSize);
            return Ok(ApiResponse<PagedResultDto<ProjectHealthDto>>.SuccessResponse(result, "Project health retrieved successfully"));
        }

        /// <summary>
        /// Obtiene el análisis de riesgo de retraso por desarrollador (con paginación)
        /// </summary>
        [HttpGet("developer-delay-risk")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<PagedResultDto<DeveloperDelayRiskDto>>>> GetDeveloperDelayRisk(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 100) pageSize = 100;

            var result = await _dashboardService.GetDeveloperDelayRiskAsync(page, pageSize);
            return Ok(ApiResponse<PagedResultDto<DeveloperDelayRiskDto>>.SuccessResponse(result, "Developer delay risk retrieved successfully"));
        }
    }
}
