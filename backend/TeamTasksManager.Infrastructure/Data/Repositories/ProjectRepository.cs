using Microsoft.EntityFrameworkCore;
using TeamTasksManager.Domain.Entities;
using TeamTasksManager.Domain.Enums;
using TeamTasksManager.Domain.Interfaces.Repositories;
using TeamTasksManager.Infrastructure.Data.Context;

namespace TeamTasksManager.Infrastructure.Data.Repositories
{
    public class ProjectRepository : GenericRepository<Project>, IProjectRepository
    {
        public ProjectRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Project>> GetProjectsByStatusAsync(ProjectStatus status)
        {
            return await _dbSet
                .Where(p => p.Status == status)
                .Include(p => p.Tasks)
                .ToListAsync();
        }

        public async Task<Project> GetProjectWithTasksAsync(int projectId)
        {
            return await _dbSet
                .Include(p => p.Tasks)
                    .ThenInclude(t => t.Assignee)
                .FirstOrDefaultAsync(p => p.ProjectId == projectId);
        }
    }
}
