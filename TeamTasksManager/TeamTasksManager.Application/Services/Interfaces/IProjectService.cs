using TeamTasksManager.Application.DTOs.Project;

namespace TeamTasksManager.Application.Services.Interfaces
{
    public interface IProjectService
    {
        Task<IEnumerable<ProjectDto>> GetAllProjectsWithStatsAsync();
        Task<ProjectDto?> GetProjectByIdAsync(int id);
    }
}
