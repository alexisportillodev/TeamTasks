import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { Task } from '@core/models';
import { StatusLabelPipe, PriorityLabelPipe } from '@shared/pipes';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    StatusLabelPipe,
    PriorityLabelPipe
  ],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent {
  constructor(
    public dialogRef: MatDialogRef<TaskDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public task: Task
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  getStatusClass(status: Task['status']): string {
    const statusMap: Record<Task['status'], string> = {
      ToDo: 'status-todo',
      InProgress: 'status-inprogress',
      Blocked: 'status-blocked',
      Completed: 'status-completed'
    };
    return statusMap[status] || '';
  }

  getPriorityClass(priority: Task['priority']): string {
    const priorityMap: Record<Task['priority'], string> = {
      Low: 'priority-low',
      Medium: 'priority-medium',
      High: 'priority-high'
    };
    return priorityMap[priority] || '';
  }
}
