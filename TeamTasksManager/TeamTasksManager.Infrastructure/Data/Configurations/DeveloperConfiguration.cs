using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TeamTasksManager.Domain.Entities;

namespace TeamTasksManager.Infrastructure.Data.Configurations
{
    public class DeveloperConfiguration : IEntityTypeConfiguration<Developer>
    {
        public void Configure(EntityTypeBuilder<Developer> builder)
        {
            builder.ToTable("developers", "core");

            builder.HasKey(d => d.DeveloperId);

            builder.Property(d => d.DeveloperId)
                .HasColumnName("developer_id");

            builder.Property(d => d.FirstName)
                .HasColumnName("first_name")
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(d => d.LastName)
                .HasColumnName("last_name")
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(d => d.Email)
                .HasColumnName("email")
                .HasMaxLength(100)
                .IsRequired();

            builder.HasIndex(d => d.Email).IsUnique();

            builder.Property(d => d.IsActive)
                .HasColumnName("is_active")
                .HasDefaultValue(true);

            builder.Property(d => d.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.Ignore(d => d.FullName);
        }
    }
}
