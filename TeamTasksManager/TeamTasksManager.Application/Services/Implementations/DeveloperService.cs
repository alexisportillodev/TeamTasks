using AutoMapper;
using TeamTasksManager.Application.DTOs;
using TeamTasksManager.Application.Services.Interfaces;
using TeamTasksManager.Domain.Entities;
using TeamTasksManager.Domain.Interfaces;

namespace TeamTasksManager.Application.Services.Implementations
{
    public class DeveloperService : IDeveloperService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public DeveloperService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<DeveloperDto>> GetAllActiveDevelopersAsync()
        {
            var developers = await _unitOfWork.Developers.GetActiveDevelopersAsync();
            return _mapper.Map<IEnumerable<DeveloperDto>>(developers);
        }

        public async Task<DeveloperDto?> GetDeveloperByIdAsync(int id)
        {
            var developer = await _unitOfWork.Developers.GetByIdAsync(id);
            return developer != null ? _mapper.Map<DeveloperDto?>(developer) : null;
        }
    }
}
