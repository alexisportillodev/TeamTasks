using Microsoft.AspNetCore.Mvc;
using TeamTasksManager.API.Common;
using TeamTasksManager.Application.DTOs;
using TeamTasksManager.Application.Services.Interfaces;

namespace TeamTasksManager.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DevelopersController : ControllerBase
    {
        private readonly IDeveloperService _developerService;

        public DevelopersController(IDeveloperService developerService)
        {
            _developerService = developerService;
        }

        /// <summary>
        /// Obtiene todos los desarrolladores activos
        /// </summary>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ApiResponse<IEnumerable<DeveloperDto>>>> GetAllDevelopers()
        {
            var developers = await _developerService.GetAllActiveDevelopersAsync();

            return Ok(ApiResponse<IEnumerable<DeveloperDto>>
                .SuccessResponse(developers));
        }

        /// <summary>
        /// Obtiene un desarrollador por ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiResponse<DeveloperDto>>> GetDeveloperById(int id)
        {
            var developer = await _developerService.GetDeveloperByIdAsync(id);

            if (developer == null)
            {
                return NotFound(ApiResponse<DeveloperDto>
                    .ErrorResponse($"Developer with ID {id} not found"));
            }

            return Ok(ApiResponse<DeveloperDto>
                .SuccessResponse(developer));
        }
    }
}
