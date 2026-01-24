import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { Developer, TaskStatus } from '@core/models';

export interface TaskFilters {
  status?: TaskStatus;
  assigneeId?: number;
}

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './task-filters.component.html',
  styleUrls: ['./task-filters.component.scss']
})
export class TaskFiltersComponent implements OnInit {
  @Input() developers: Developer[] = [];
  @Output() filtersChange = new EventEmitter<TaskFilters>();

  // Formulario reactivo
  filterForm = new FormGroup({
    status: new FormControl<TaskStatus | ''>(''),
    assigneeId: new FormControl<number | ''>('')
  });

  statusOptions: { value: TaskStatus | ''; label: string }[] = [
    { value: '', label: 'Todos los estados' },
    { value: 'ToDo', label: 'Por Hacer' },
    { value: 'InProgress', label: 'En Progreso' },
    { value: 'Blocked', label: 'Bloqueada' },
    { value: 'Completed', label: 'Completada' }
  ];

  ngOnInit(): void {
    // Escucha cambios en el formulario
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    const { status, assigneeId } = this.filterForm.value;
    const filters: TaskFilters = {};

    if (status) filters.status = status;
    if (assigneeId !== '' && assigneeId !== null && assigneeId !== undefined) filters.assigneeId = Number(assigneeId);

    this.filtersChange.emit(filters);
  }

  clearFilters(): void {
    this.filterForm.reset({ status: '', assigneeId: '' });
  }
}
