namespace TeamTasksManager.Application.Services.Interfaces
{
    public interface IProjectService<T> where T : class
    {
        Task<IEnumerable<T>> GetAllProjectsWithStatsAsync();
        Task<T> GetProjectByIdAsync(int id);
    }
}
