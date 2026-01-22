using TeamTasksManager.Domain.Entities;

namespace TeamTasksManager.Domain.Interfaces.Repositories
{
    public interface IDeveloperRepository : IGenericRepository<Developer>
    {
        Task<IEnumerable<Developer>> GetActiveDevelopersAsync();
        Task GetByEmailAsync(string email);
    }
}
