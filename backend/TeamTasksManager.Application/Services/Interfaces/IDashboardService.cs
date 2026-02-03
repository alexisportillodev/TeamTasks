using TeamTasksManager.Application.DTOs.Dashboard;
using TeamTasksManager.Application.DTOs.Common;

namespace TeamTasksManager.Application.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<PagedResultDto<DeveloperWorkloadDto>> GetDeveloperWorkloadAsync(int page = 1, int pageSize = 10);
        Task<PagedResultDto<ProjectHealthDto>> GetProjectHealthAsync(int page = 1, int pageSize = 10);
        Task<PagedResultDto<DeveloperDelayRiskDto>> GetDeveloperDelayRiskAsync(int page = 1, int pageSize = 10);
    }
} 
