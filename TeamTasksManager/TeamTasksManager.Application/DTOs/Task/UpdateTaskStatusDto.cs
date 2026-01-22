namespace TeamTasksManager.Application.DTOs.Task
{
    public class UpdateTaskStatusDto
    {
        public string Status { get; set; } = string.Empty;
        public string? Priority { get; set; }
        public int? EstimatedComplexity { get; set; }
    }
}
