using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using TeamTasksManager.Domain.Entities;

namespace TeamTasksManager.Infrastructure.Data.Configurations
{
    public class TaskItemConfiguration : IEntityTypeConfiguration<TaskItem>
    {
        public void Configure(EntityTypeBuilder<TaskItem> builder)
        {
            builder.ToTable("tasks", "core");

            builder.HasKey(t => t.TaskId);

            builder.Property(t => t.TaskId)
                .HasColumnName("task_id");

            builder.Property(t => t.ProjectId)
                .HasColumnName("project_id")
                .IsRequired();

            builder.Property(t => t.Title)
                .HasColumnName("title")
                .HasMaxLength(150)
                .IsRequired();

            builder.Property(t => t.Description)
                .HasColumnName("description");

            builder.Property(t => t.AssigneeId)
                .HasColumnName("assignee_id");

            builder.Property(t => t.Status)
                .HasColumnName("status")
                .HasMaxLength(20)
                .HasConversion<string>()
                .IsRequired();

            builder.Property(t => t.Priority)
                .HasColumnName("priority")
                .HasMaxLength(10)
                .HasConversion<string>()
                .IsRequired();

            builder.Property(t => t.EstimatedComplexity)
                .HasColumnName("estimated_complexity");

            builder.Property(t => t.DueDate)
                .HasColumnName("due_date")
                .IsRequired();

            builder.Property(t => t.CompletionDate)
                .HasColumnName("completion_date");

            builder.Property(t => t.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        }
    }
}
