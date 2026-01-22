namespace TeamTasksManager.Application.DTOs.Task
{
    public class CreateTaskDto
    {
        public int ProjectId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? AssigneeId { get; set; }
        public string Status { get; set; } = "ToDo";
        public string Priority { get; set; } = "Medium";
        public int? EstimatedComplexity { get; set; }
        public DateTime? DueDate { get; set; }
    }
}
