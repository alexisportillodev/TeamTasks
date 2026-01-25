using System.Linq.Expressions;
using AutoMapper;
using FluentAssertions;
using Moq;
using TeamTasksManager.Application.DTOs.Task;
using TeamTasksManager.Application.Mappings;
using TeamTasksManager.Application.Services.Implementations;
using TeamTasksManager.Domain.Entities;
using TeamTasksManager.Domain.Enums;
using TeamTasksManager.Domain.Interfaces;
using TeamTasksManager.Tests.Fixtures;

namespace TeamTasksManager.Tests.Unit.Services
{
    public class TaskServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly IMapper _mapper;
        private readonly TaskService _taskService;

        public TaskServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
            _mapper = config.CreateMapper();
            _taskService = new TaskService(_unitOfWorkMock.Object, _mapper);
        }

        [Fact]
        public async Task CreateTask_ProjectDoesNotExist_ThrowsException()
        {
            // Arrange
            var dto = new CreateTaskDto
            {
                ProjectId = 999,
                Title = "Test Task",
                Status = "ToDo",
                Priority = "High",
                DueDate = DateTime.Today.AddDays(7)
            };

            _unitOfWorkMock
                .Setup(u => u.Projects.ExistsAsync(It.IsAny<Expression<Func<Project, bool>>>()))
                .ReturnsAsync(false);

            // Act & Assert
            var act = async () => await _taskService.CreateTaskAsync(dto);
            await act.Should().ThrowAsync<Exception>()
                .WithMessage("*proyecto*no existe*");
        }

        [Fact]
        public async Task CreateTask_DeveloperDoesNotExist_ThrowsException()
        {
            // Arrange
            var dto = new CreateTaskDto
            {
                ProjectId = 1,
                Title = "Test Task",
                AssigneeId = 999,
                Status = "ToDo",
                Priority = "High",
                DueDate = DateTime.Today.AddDays(7)
            };

            _unitOfWorkMock
                .Setup(u => u.Projects.ExistsAsync(It.IsAny<Expression<Func<Project, bool>>>()))
                .ReturnsAsync(true);

            _unitOfWorkMock
                .Setup(u => u.Developers.ExistsAsync(It.IsAny<Expression<Func<Developer, bool>>>()))
                .ReturnsAsync(false);

            var act = async () => await _taskService.CreateTaskAsync(dto);
            await act.Should().ThrowAsync<Exception>()
                .WithMessage("*desarrollador*no existe*");
        }

        [Fact]
        public async Task UpdateTaskStatus_ToCompleted_SetsCompletionDate()
        {
            // Arrange
            var taskId = 1;
            var updateDto = new UpdateTaskStatusDto { Status = "Completed" };
            var existingTask = TestDataFixture.GetValidTask();
            existingTask.Status = TaskItemStatus.InProgress;
            existingTask.CompletionDate = null;
            existingTask.Project = TestDataFixture.GetValidProject();

            _unitOfWorkMock.Setup(u => u.Tasks.GetByIdAsync(taskId))
                .ReturnsAsync(existingTask);
            _unitOfWorkMock.Setup(u => u.Tasks.UpdateAsync(It.IsAny<TaskItem>()))
                .Returns(Task.CompletedTask);
            _unitOfWorkMock.Setup(u => u.SaveChangesAsync())
                .ReturnsAsync(1);

            // Act
            var result = await _taskService.UpdateTaskStatusAsync(taskId, updateDto);

            // Assert
            result.Should().NotBeNull();
            result!.Status.Should().Be("Completed");
            result.CompletionDate.Should().NotBeNull();
            result.CompletionDate.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
        }

        [Fact]
        public async Task CreateTask_ValidData_SavesAndReturnsTask()
        {
            // Arrange
            var dto = new CreateTaskDto
            {
                ProjectId = 1,
                Title = "New Task",
                Status = "ToDo",
                Priority = "High",
                DueDate = DateTime.Today.AddDays(7)
            };

            _unitOfWorkMock
                .Setup(u => u.Projects.ExistsAsync(It.IsAny<Expression<Func<Project, bool>>>()))
                .ReturnsAsync(true);
            _unitOfWorkMock
                .Setup(u => u.Tasks.AddAsync(It.IsAny<TaskItem>()))
                .Returns((TaskItem t) => Task.FromResult(t));
            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync())
                .ReturnsAsync(1);

            var taskWithRelations = TestDataFixture.GetValidTask();
            taskWithRelations.Title = "New Task";
            taskWithRelations.Project = TestDataFixture.GetValidProject();

            _unitOfWorkMock.Setup(u => u.Tasks.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(taskWithRelations);

            // Act
            var result = await _taskService.CreateTaskAsync(dto);

            // Assert
            result.Should().NotBeNull();
            result.Title.Should().Be("New Task");
            _unitOfWorkMock.Verify(u => u.Tasks.AddAsync(It.IsAny<TaskItem>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
        }
    }
}
