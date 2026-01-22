using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using TeamTasksManager.Domain.Entities;
using TeamTasksManager.Domain.Enums;

namespace TeamTasksManager.Infrastructure.Data.Configurations
{
    public class ProjectConfiguration : IEntityTypeConfiguration<Project>
    {
        public void Configure(EntityTypeBuilder<Project> builder)
        {
            builder.ToTable("projects", "core");

            builder.HasKey(p => p.ProjectId);

            builder.Property(p => p.ProjectId)
                .HasColumnName("project_id");

            builder.Property(p => p.Name)
                .HasColumnName("name")
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(p => p.ClientName)
                .HasColumnName("client_name")
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(p => p.StartDate)
                .HasColumnName("start_date")
                .IsRequired();

            builder.Property(p => p.EndDate)
                .HasColumnName("end_date");

            builder.Property(p => p.Status)
                .HasColumnName("status")
                .HasMaxLength(20)
                .HasConversion<string>()
                .IsRequired();
        }
    }
}
