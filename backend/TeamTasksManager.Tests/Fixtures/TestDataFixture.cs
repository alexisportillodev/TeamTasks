using TeamTasksManager.Domain.Entities;
using TeamTasksManager.Domain.Enums;

namespace TeamTasksManager.Tests.Fixtures
{
    public static class TestDataFixture
    {
        public static Developer GetValidDeveloper() => new()
        {
            DeveloperId = 1,
            FirstName = "Juan",
            LastName = "Perez",
            Email = "juan@test.com",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        public static Project GetValidProject() => new()
        {
            ProjectId = 1,
            Name = "Test Project",
            ClientName = "Test Client",
            StartDate = DateTime.UtcNow,
            Status = ProjectStatus.InProgress
        };

        public static TaskItem GetValidTask() => new()
        {
            TaskId = 1,
            ProjectId = 1,
            Title = "Test Task",
            Status = TaskItemStatus.InProgress,
            Priority = TaskPriority.High,
            DueDate = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow
        };
    }
}
