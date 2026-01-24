using Microsoft.AspNetCore.Mvc;
using TeamTasksManager.API.Common;
using TeamTasksManager.Application.DTOs.Dashboard;
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
        /// Obtiene el resumen de carga de trabajo por desarrollador
        /// </summary>
        [HttpGet("developer-workload")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<IEnumerable<DeveloperWorkloadDto>>>> GetDeveloperWorkload()
        {
            var workload = await _dashboardService.GetDeveloperWorkloadAsync();
            return Ok(ApiResponse<IEnumerable<DeveloperWorkloadDto>>.SuccessResponse(workload, "Developer workload retrieved successfully"));
        }

        /// <summary>
        /// Obtiene el resumen de estado de salud por proyecto
        /// </summary>
        [HttpGet("project-health")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<IEnumerable<ProjectHealthDto>>>> GetProjectHealth()
        {
            var health = await _dashboardService.GetProjectHealthAsync();
            return Ok(ApiResponse<IEnumerable<ProjectHealthDto>>.SuccessResponse(health, "Project health retrieved successfully"));
        }

        /// <summary>
        /// Obtiene el análisis de riesgo de retraso por desarrollador
        /// </summary>
        [HttpGet("developer-delay-risk")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse<IEnumerable<DeveloperDelayRiskDto>>>> GetDeveloperDelayRisk()
        {
            var risk = await _dashboardService.GetDeveloperDelayRiskAsync();
            return Ok(ApiResponse<IEnumerable<DeveloperDelayRiskDto>>.SuccessResponse(risk, "Developer delay risk retrieved successfully"));
        }
    }
}
