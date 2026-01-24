using TeamTasksManager.Domain.Entities;
using TeamTasksManager.Domain.Enums;

namespace TeamTasksManager.Domain.Interfaces.Repositories
{
    public interface IProjectRepository : IGenericRepository<Project>
    {
        Task<IEnumerable<Project>> GetProjectsByStatusAsync(ProjectStatus status);
        Task<Project> GetProjectWithTasksAsync(int projectId);
    }
}
