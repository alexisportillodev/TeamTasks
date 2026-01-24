namespace TeamTasksManager.Application.DTOs.Dashboard
{
    public class DeveloperDelayRiskDto
    {
        public string DeveloperName { get; set; } = string.Empty;
        public int OpenTasksCount { get; set; }
        public decimal AvgDelayDays { get; set; }
        public DateTime? NearestDueDate { get; set; }
        public DateTime? LatestDueDate { get; set; }
        public DateTime? PredictedCompletionDate { get; set; }
        public int HighRiskFlag { get; set; }
    }
}
