import { Pipe, PipeTransform } from '@angular/core';
import { TaskPriority } from '@core/models';

@Pipe({
  name: 'priorityLabel',
  standalone: true
})
export class PriorityLabelPipe implements PipeTransform {

  // Tipamos la clave como string y el valor como string
  private readonly priorityLabels: Record<string, string> = {
    'Low': 'Baja',
    'Medium': 'Media',
    'High': 'Alta'
  };

  transform(priority: TaskPriority): string {
    return this.priorityLabels[priority] || priority;
  }
}
