using FluentValidation;
using System.Data;
using TeamTasksManager.Application.DTOs.Task;

namespace TeamTasksManager.Application.Validators
{
    public class UpdateTaskStatusDtoValidator : AbstractValidator<UpdateTaskStatusDto>
    {
        public UpdateTaskStatusDtoValidator()
        {
            RuleFor(x => x.Status)
                .NotEmpty()
                .Must(status => new[] { "ToDo", "InProgress", "Blocked", "Completed" }.Contains(status))
                .WithMessage("Estado inválido. Valores permitidos: ToDo, InProgress, Blocked, Completed");

            RuleFor(x => x.Priority)
                .Must(priority => new[] { "Low", "Medium", "High" }.Contains(priority!))
                .When(x => !string.IsNullOrEmpty(x.Priority))
                .WithMessage("Prioridad inválida. Valores permitidos: Low, Medium, High");

            RuleFor(x => x.EstimatedComplexity)
                .InclusiveBetween(1, 5)
                .When(x => x.EstimatedComplexity.HasValue)
                .WithMessage("La complejidad debe estar entre 1 y 5");
        }
    }
}
