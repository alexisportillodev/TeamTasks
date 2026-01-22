namespace TeamTasksManager.Application.Services.Interfaces
{
    public interface IDashboardService<T> where T : class
    {
        Task<IEnumerable<T>> GetDeveloperWorkloadAsync();
        Task<IEnumerable<T>> GetProjectHealthAsync();
        Task<IEnumerable<T>> GetDeveloperDelayRiskAsync();
    }
}
