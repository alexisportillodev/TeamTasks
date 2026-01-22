using System.Collections;
using TeamTasksManager.Domain.Enums;

namespace TeamTasksManager.Domain.Entities
{
    public class Project
    {
        public int ProjectId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ClientName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public ProjectStatus Status { get; set; }

        // Navigation property
        public virtual ICollection Tasks { get; set; } = new List<TaskItem>();
    }
}
