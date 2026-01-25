using FluentAssertions;
using TeamTasksManager.Application.DTOs.Task;
using TeamTasksManager.Application.Validators;

namespace TeamTasksManager.Tests.Unit.Validators
{
    public class CreateTaskDtoValidatorTests
    {
        private readonly CreateTaskDtoValidator _validator = new();

        [Fact]
        public void CreateTask_MissingRequiredFields_ShouldFail()
        {
            // Arrange - DTO sin campos requeridos
            var dto = new CreateTaskDto();

            // Act
            var result = _validator.Validate(dto);

            // Assert
            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.PropertyName == "ProjectId");
            result.Errors.Should().Contain(e => e.PropertyName == "Title");
            result.Errors.Should().Contain(e => e.PropertyName == "DueDate");
        }

        [Fact]
        public void CreateTask_InvalidComplexity_ShouldFail()
        {
            // Arrange - Complejidad fuera del rango 1-5
            var dto = new CreateTaskDto
            {
                ProjectId = 1,
                Title = "Test",
                Status = "ToDo",
                Priority = "High",
                EstimatedComplexity = 10, // Inválido
                DueDate = DateTime.Today.AddDays(7)
            };

            // Act
            var result = _validator.Validate(dto);

            // Assert
            result.IsValid.Should().BeFalse();
            result.Errors.Should().ContainSingle(e => e.PropertyName == "EstimatedComplexity");
        }

        [Fact]
        public void CreateTask_PastDueDate_ShouldFail()
        {
            // Arrange - Fecha de vencimiento en el pasado
            var dto = new CreateTaskDto
            {
                ProjectId = 1,
                Title = "Test",
                Status = "ToDo",
                Priority = "High",
                DueDate = DateTime.Today.AddDays(-1) // Fecha pasada
            };

            // Act
            var result = _validator.Validate(dto);

            // Assert
            result.IsValid.Should().BeFalse();
            result.Errors.Should().ContainSingle(e => e.PropertyName == "DueDate");
        }
    }
}
