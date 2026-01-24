using AutoMapper;
using TeamTasksManager.Domain.Entities;
using TeamTasksManager.Domain.Enums;
using TeamTasksManager.Application.DTOs;
using TeamTasksManager.Application.DTOs.Project;
using TeamTasksManager.Application.DTOs.Task;

namespace TeamTasksManager.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // ========== Developer ==========
            CreateMap<Developer, DeveloperDto>();

            // ========== Project ==========
            CreateMap<Project, ProjectDto>()
                .ForMember(dest => dest.Status,
                    opt => opt.MapFrom(src => src.Status.ToString()));

            CreateMap<Project, ProjectWithStatsDto>()
                .ForMember(dest => dest.Status,
                    opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.TotalTasks,
                    opt => opt.MapFrom(src => src.Tasks.Count))
                .ForMember(dest => dest.OpenTasks,
                    opt => opt.MapFrom(src =>
                        src.Tasks.Count(t => t.Status != TaskItemStatus.Completed)))
                .ForMember(dest => dest.CompletedTasks,
                    opt => opt.MapFrom(src =>
                        src.Tasks.Count(t => t.Status == TaskItemStatus.Completed)));

            // ========== Task ==========
            CreateMap<TaskItem, TaskDto>()
                .ForMember(dest => dest.ProjectName,
                    opt => opt.MapFrom(src => src.Project.Name))
                .ForMember(dest => dest.AssigneeName,
                    opt => opt.MapFrom(src =>
                        src.Assignee != null ? src.Assignee.FullName : null))
                .ForMember(dest => dest.Status,
                    opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.Priority,
                    opt => opt.MapFrom(src => src.Priority.ToString()));

            CreateMap<CreateTaskDto, TaskItem>()
                .ForMember(dest => dest.Status,
                    opt => opt.MapFrom(src =>
                        Enum.Parse<TaskItemStatus>(src.Status, true)))
                .ForMember(dest => dest.Priority,
                    opt => opt.MapFrom(src =>
                        Enum.Parse<TaskPriority>(src.Priority, true)))
                .ForMember(dest => dest.CreatedAt,
                    opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.DueDate,
                    opt => opt.MapFrom(src =>
                        src.DueDate.HasValue
                            ? DateTime.SpecifyKind(src.DueDate.Value, DateTimeKind.Utc)
                            : (DateTime?)null
                    ));
        }
    }
}
