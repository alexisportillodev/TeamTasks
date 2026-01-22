using TeamTasksManager.Application.DTOs;

namespace TeamTasksManager.Application.Services.Interfaces
{
    public interface IDeveloperService
    {
        Task<IEnumerable<DeveloperDto>> GetAllActiveDevelopersAsync();
        Task<DeveloperDto?> GetDeveloperByIdAsync(int id);
    }
}
