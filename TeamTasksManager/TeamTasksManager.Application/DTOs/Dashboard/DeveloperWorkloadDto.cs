namespace TeamTasksManager.Application.DTOs.Dashboard
{
    public class DeveloperWorkloadDto
    {
        public string DeveloperName { get; set; } = string.Empty;
        public int OpenTasksCount { get; set; }
        public decimal AverageEstimatedComplexity { get; set; }
    }
}
