namespace TeamTasksManager.Application.Services.Interfaces
{
    public interface IDeveloperService<T> where T : class
    {
        Task<IEnumerable<T>> GetAllActiveDevelopersAsync();
        Task<T> GetDeveloperByIdAsync(int id);
    }
}
