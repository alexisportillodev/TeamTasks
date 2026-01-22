using AutoMapper;
using TeamTasksManager.Application.Services.Interfaces;
using TeamTasksManager.Domain.Entities;
using TeamTasksManager.Domain.Interfaces;

namespace TeamTasksManager.Application.Services.Implementations
{
    public class DeveloperService : IDeveloperService<Developer>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public DeveloperService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Developer>> GetAllActiveDevelopersAsync()
        {
            var developers = await _unitOfWork.Developers.GetActiveDevelopersAsync();
            return _mapper.Map<IEnumerable<Developer>>(developers);
        }

        public async Task<Developer> GetDeveloperByIdAsync(int id)
        {
            var developer = await _unitOfWork.Developers.GetByIdAsync(id);
            return developer != null ? _mapper.Map<Developer>(developer) : null;
        }
    }
}
