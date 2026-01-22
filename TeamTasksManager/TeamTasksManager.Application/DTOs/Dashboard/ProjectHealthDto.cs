namespace TeamTasksManager.Application.DTOs.Dashboard
{
    public class ProjectHealthDto
    {
        public string ProjectName { get; set; } = string.Empty;
        public int TotalTasks { get; set; }
        public int OpenTasks { get; set; }
        public int CompletedTasks { get; set; }
    }
}
