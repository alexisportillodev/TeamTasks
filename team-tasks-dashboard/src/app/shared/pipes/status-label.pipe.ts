import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus, ProjectStatus } from '@core/models';

@Pipe({
  name: 'statusLabel',
  standalone: true
})
export class StatusLabelPipe implements PipeTransform {

  // Tipamos la clave como string y el valor como string
  private readonly statusLabels: Record<string, string> = {
    'ToDo': 'Por Hacer',
    'InProgress': 'En Progreso',
    'Blocked': 'Bloqueada',
    'Completed': 'Completada',
    'Planned': 'Planificado'
  };

  transform(status: TaskStatus | ProjectStatus): string {
    return this.statusLabels[status] || status;
  }
}
