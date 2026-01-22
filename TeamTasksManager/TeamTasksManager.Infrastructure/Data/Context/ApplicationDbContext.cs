using Microsoft.EntityFrameworkCore;
using TeamTasksManager.Domain.Entities;
using TeamTasksManager.Infrastructure.Data.Configurations;

namespace TeamTasksManager.Infrastructure.Data.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options)
            : base(options)
        {
        }

        public DbSet<Developer> Developers { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Aplicar configuraciones
            modelBuilder.ApplyConfiguration(new DeveloperConfiguration());
            modelBuilder.ApplyConfiguration(new ProjectConfiguration());
            modelBuilder.ApplyConfiguration(new TaskItemConfiguration());
        }
    }
}
