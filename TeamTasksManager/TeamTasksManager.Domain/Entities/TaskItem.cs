using TeamTasksManager.Domain.Common;
using TeamTasksManager.Domain.Enums;

namespace TeamTasksManager.Domain.Entities
{
    public class TaskItem : BaseEntity
    {
        public int TaskId { get; set; }
        public int ProjectId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? AssigneeId { get; set; }
        public Enums.TaskItemStatus Status { get; set; }
        public TaskPriority Priority { get; set; }
        public int? EstimatedComplexity { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? CompletionDate { get; set; }

        // Navigation properties
        public virtual Project Project { get; set; } = null!;
        public virtual Developer? Assignee { get; set; }
    }
}
