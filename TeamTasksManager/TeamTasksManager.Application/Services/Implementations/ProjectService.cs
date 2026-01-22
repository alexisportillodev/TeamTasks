using AutoMapper;
using TeamTasksManager.Application.Services.Interfaces;
using TeamTasksManager.Domain.Entities;
using TeamTasksManager.Domain.Interfaces;

namespace TeamTasksManager.Application.Services.Implementations
{
    public class ProjectService : IProjectService<Project>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ProjectService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Project>> GetAllProjectsWithStatsAsync()
        {
            var projects = await _unitOfWork.Projects.GetAllAsync();
            return _mapper.Map<IEnumerable<Project>>(projects);
        }

        public async Task<Project> GetProjectByIdAsync(int id)
        {
            var project = await _unitOfWork.Projects.GetByIdAsync(id);
            return project != null ? _mapper.Map<Project>(project) : null;
        }
    }
}
