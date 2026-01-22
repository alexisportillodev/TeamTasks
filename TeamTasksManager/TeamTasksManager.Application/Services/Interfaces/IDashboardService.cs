using TeamTasksManager.Application.DTOs.Dashboard;

namespace TeamTasksManager.Application.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<IEnumerable<DeveloperWorkloadDto>> GetDeveloperWorkloadAsync();
        Task<IEnumerable<ProjectHealthDto>> GetProjectHealthAsync();
        Task<IEnumerable<DeveloperDelayRiskDto>> GetDeveloperDelayRiskAsync();
    }
}
