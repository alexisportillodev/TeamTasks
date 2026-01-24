using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TeamTasksManager.Domain.Interfaces;
using TeamTasksManager.Domain.Interfaces.Repositories;
using TeamTasksManager.Infrastructure.Data;
using TeamTasksManager.Infrastructure.Data.Context;
using TeamTasksManager.Infrastructure.Data.Repositories;

namespace TeamTasksManager.Infrastructure.DependencyInjection
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            // DbContext
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseNpgsql(
                    configuration.GetConnectionString("DefaultConnection"),
                    b => b.MigrationsAssembly("TeamTasksManager.Infrastructure")
                );
            });

            // Unit of Work
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Repositories
            services.AddScoped<IDeveloperRepository, DeveloperRepository>();
            services.AddScoped<IProjectRepository, ProjectRepository>();
            services.AddScoped<ITaskRepository, TaskRepository>();

            return services;
        }
    }
}
