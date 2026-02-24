using FluentValidation;
using TeamTasksManager.Application.DTOs.Task;

namespace TeamTasksManager.Application.Validators
{
    public class CreateTaskDtoValidator : AbstractValidator<CreateTaskDto>
    {
        private static readonly string[] ValidStatus =
        {
            "ToDo", "InProgress", "Blocked", "Completed"
        };

        private static readonly string[] ValidPriorities =
        {
            "Low", "Medium", "High"
        };

        public CreateTaskDtoValidator()
        {
            RuleFor(x => x.ProjectId)
                .GreaterThan(0)
                .WithMessage("ProjectId debe ser mayor a 0");

            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("El título es requerido")
                .MaximumLength(150).WithMessage("El título no puede exceder 150 caracteres");

            RuleFor(x => x.Status)
                .NotEmpty().WithMessage("El estado es requerido")
                .Must(status => ValidStatus.Contains(status))
                .WithMessage("Estado inválido. Valores permitidos: ToDo, InProgress, Blocked, Completed");

            RuleFor(x => x.Priority)
                .NotEmpty().WithMessage("La prioridad es requerida")
                .Must(priority => ValidPriorities.Contains(priority))
                .WithMessage("Prioridad inválida. Valores permitidos: Low, Medium, High");

            RuleFor(x => x.EstimatedComplexity)
                .InclusiveBetween(1, 5)
                .When(x => x.EstimatedComplexity.HasValue)
                .WithMessage("La complejidad debe estar entre 1 y 5");

            RuleFor(x => x.DueDate)
                .NotNull().WithMessage("La fecha de vencimiento es requerida")
                .Must(date => date >= DateTime.Today)
                .WithMessage("La fecha de vencimiento debe ser hoy o posterior");
        }
    }
}
