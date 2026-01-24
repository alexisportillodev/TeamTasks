using TeamTasksManager.Domain.Entities;

namespace TeamTasksManager.Domain.Interfaces.Repositories
{
    public interface IDeveloperRepository : IGenericRepository<Developer>
    {
        Task<IEnumerable<Developer>> GetActiveDevelopersAsync();
        Task<Developer> GetByEmailAsync(string email);
    }
}
