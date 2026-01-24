import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

import { TaskService, ProjectService, DeveloperService } from '@core/services';
import { CreateTaskDto, Developer, Project, TaskPriority, TaskStatus } from '@core/models';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly projectService = inject(ProjectService);
  private readonly developerService = inject(DeveloperService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  taskForm!: FormGroup;

  loading = signal(false);
  loadingData = signal(true);

  projects = signal<Project[]>([]);
  developers = signal<Developer[]>([]);

  minDate = new Date();

  statusOptions: { value: TaskStatus; label: string }[] = [
    { value: 'ToDo', label: 'Por Hacer' },
    { value: 'InProgress', label: 'En Progreso' },
    { value: 'Blocked', label: 'Bloqueada' },
    { value: 'Completed', label: 'Completada' }
  ];

  priorityOptions: { value: TaskPriority; label: string }[] = [
    { value: 'Low', label: 'Baja' },
    { value: 'Medium', label: 'Media' },
    { value: 'High', label: 'Alta' }
  ];

  complexityOptions = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    this.initForm();
    this.loadFormData();
    this.checkQueryParams();
  }

  private initForm(): void {
    this.taskForm = this.fb.group({
      projectId: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(150)]],
      description: [''],
      assigneeId: [''],
      status: ['ToDo', Validators.required],
      priority: ['Medium', Validators.required],
      estimatedComplexity: [null, [Validators.min(1), Validators.max(5)]],
      dueDate: ['', Validators.required]
    });
  }

  private loadFormData(): void {
    forkJoin({
      projects: this.projectService.getAllProjects(),
      developers: this.developerService.getAllDevelopers()
    }).subscribe({
      next: ({ projects, developers }) => {
        this.projects.set(projects || []);
        this.developers.set(developers || []);
        this.loadingData.set(false);
      },
      error: () => {
        this.showError('Error al cargar los datos del formulario');
        this.loadingData.set(false);
      }
    });
  }

  private checkQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectId']) {
        this.taskForm.patchValue({
          projectId: Number(params['projectId'])
        });
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.markFormGroupTouched(this.taskForm);
      this.showError('Por favor, complete los campos obligatorios');
      return;
    }

    this.loading.set(true);

    const formValue = this.taskForm.value;

    const dto: CreateTaskDto = {
      projectId: formValue.projectId,
      title: formValue.title.trim(),
      description: formValue.description?.trim() || undefined,
      assigneeId: formValue.assigneeId || undefined,
      status: formValue.status,
      priority: formValue.priority,
      estimatedComplexity: formValue.estimatedComplexity ?? undefined,
      dueDate: this.formatDate(formValue.dueDate)
    };

    this.taskService.createTask(dto).subscribe({
      next: task => {
        this.showSuccess('Tarea creada correctamente');
        this.router.navigate(['/projects', task.projectId, 'tasks']);
      },
      error: () => {
        this.showError('Error al crear la tarea');
        this.loading.set(false);
      }
    });
  }

  cancel(): void {
    if (confirm('¿Deseas cancelar? Se perderán los cambios.')) {
      this.router.navigate(['/dashboard']);
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => control.markAsTouched());
  }

  getErrorMessage(field: string): string {
    const control = this.taskForm.get(field);
    if (!control || !control.touched) return '';

    if (control.hasError('required')) return 'Este campo es obligatorio';
    if (control.hasError('maxlength')) return 'Supera el máximo permitido';

    return '';
  }

  private showSuccess(msg: string): void {
    this.snackBar.open(msg, 'Cerrar', { duration: 3000, verticalPosition: 'top' });
  }

  private showError(msg: string): void {
    this.snackBar.open(msg, 'Cerrar', { duration: 4000, verticalPosition: 'top', panelClass: ['error-snackbar'] });
  }
}
