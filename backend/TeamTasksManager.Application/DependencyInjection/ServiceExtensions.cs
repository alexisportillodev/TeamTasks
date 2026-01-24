using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using TeamTasksManager.Application.Services.Implementations;
using TeamTasksManager.Application.Services.Interfaces;
using TeamTasksManager.Infrastructure.Services;

namespace TeamTasksManager.Application.DependencyInjection
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            // AutoMapper
            services.AddAutoMapper(typeof(ServiceExtensions).Assembly);

            // FluentValidation
            services.AddValidatorsFromAssembly(typeof(ServiceExtensions).Assembly);

            // Application Services
            services.AddScoped<ITaskService, TaskService>();
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<IProjectService, ProjectService>();
            services.AddScoped<IDeveloperService, DeveloperService>();

            return services;
        }
    }
}
