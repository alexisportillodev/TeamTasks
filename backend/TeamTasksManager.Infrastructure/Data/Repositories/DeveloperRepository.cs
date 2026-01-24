using Microsoft.EntityFrameworkCore;
using TeamTasksManager.Domain.Entities;
using TeamTasksManager.Domain.Interfaces.Repositories;
using TeamTasksManager.Infrastructure.Data.Context;

namespace TeamTasksManager.Infrastructure.Data.Repositories
{
    public class DeveloperRepository
        : GenericRepository<Developer>, IDeveloperRepository
    {
        public DeveloperRepository(ApplicationDbContext context)
            : base(context)
        {
        }

        public async Task<IEnumerable<Developer>> GetActiveDevelopersAsync()
        {
            return await _dbSet
                .Where(d => d.IsActive)
                .OrderBy(d => d.FirstName)
                .ToListAsync();
        }

        public async Task<Developer?> GetByEmailAsync(string email)
        {
            return await _dbSet
                .FirstOrDefaultAsync(d => d.Email == email);
        }
    }
}
