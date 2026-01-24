namespace TeamTasksManager.Domain.Common
{
    public abstract class BaseEntity
    {
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
