import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ProjectService, DeveloperService } from '@core/services';
import { Developer, PagedResult, Task, TaskStatus } from '@core/models';
import { DataTableComponent, TableColumn } from '@shared/components/data-table/data-table.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { PaginatorComponent } from '@shared/components/paginator/paginator.component';
import { TaskFiltersComponent, TaskFilters } from '@shared/components/task-filters/task-filters.component';
import { TaskDetailComponent } from '@shared/components/task-detail/task-detail.component';
import { StatusLabelPipe, PriorityLabelPipe } from '@shared/pipes';

import { TaskStatusChartComponent, TaskStatusData } from '@shared/components/task-status-chart/task-status-chart.component';

// Mapeo de clases para status y priority
const statusMap: Record<TaskStatus, string> = {
  ToDo: 'status-todo',
  InProgress: 'status-inprogress',
  Blocked: 'status-blocked',
  Completed: 'status-completed'
};

const priorityMap: Record<'Low' | 'Medium' | 'High', string> = {
  Low: 'priority-low',
  Medium: 'priority-medium',
  High: 'priority-high'
};

@Component({
  selector: 'app-project-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    DataTableComponent,
    LoadingSpinnerComponent,
    PaginatorComponent,
    TaskFiltersComponent,
    TaskStatusChartComponent, // ✅ gráfico
    StatusLabelPipe,
    PriorityLabelPipe
  ],
  templateUrl: './project-tasks.component.html',
  styleUrls: ['./project-tasks.component.scss']
})
export class ProjectTasksComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly developerService = inject(DeveloperService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  projectId = signal(0);
  projectName = signal('');
  loading = signal(true);
  error = signal<string | null>(null);

  tasks = signal<Task[]>([]);
  developers = signal<Developer[]>([]);

  currentPage = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);

  currentFilters = signal<TaskFilters>({});

  // ✅ data para el gráfico
  chartData = signal<TaskStatusData[]>([]);

  taskColumns: TableColumn<Task>[] = [
    { key: 'title', label: 'Título', sortable: true },
    { key: 'assigneeName', label: 'Asignado a', format: v => v || 'Sin asignar' },
    { 
      key: 'status', 
      label: 'Estado',
      format: v => new StatusLabelPipe().transform(v),
      cssClass: (v: TaskStatus) => statusMap[v] || ''
    },
    { 
      key: 'priority', 
      label: 'Prioridad',
      format: v => new PriorityLabelPipe().transform(v),
      cssClass: (v: 'Low' | 'Medium' | 'High') => priorityMap[v] || ''
    },
    { key: 'estimatedComplexity', label: 'Complejidad', format: v => v ?? 'N/A' },
    { key: 'createdAt', label: 'Fecha de Creación', format: v => new Date(v).toLocaleDateString() },
    { key: 'dueDate', label: 'Fecha de Vencimiento', format: v => new Date(v).toLocaleDateString() }
  ];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.projectId.set(id);
        this.loadProject();
        this.loadDevelopers();
        this.loadTasks();
      }
    });
  }

  private loadProject(): void {
    this.projectService.getProjectById(this.projectId()).subscribe({
      next: project => this.projectName.set(project.name),
      error: () => this.error.set('No se pudo cargar el proyecto')
    });
  }

  private loadDevelopers(): void {
    this.developerService.getAllDevelopers().subscribe({
      next: devs => this.developers.set(devs),
      error: err => console.error('Error loading developers', err)
    });
  }

  public loadTasks(): void {
    this.loading.set(true);
    this.error.set(null);

    const filters = this.currentFilters();

    this.projectService.getProjectTasks(
      this.projectId(),
      this.currentPage(),
      this.pageSize(),
      filters.status,
      filters.assigneeId
    ).subscribe({
      next: (result: PagedResult<Task>) => {
        this.tasks.set(result.items);
        this.totalItems.set(result.totalCount);
        this.calculateChartData(); // ✅ calcular gráfico
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err?.message || 'Error al cargar tareas');
        this.loading.set(false);
      }
    });
  }

  // ✅ calcula info del gráfico
  calculateChartData(): void {
    const statusCounts: Record<TaskStatus, number> = {
      ToDo: 0,
      InProgress: 0,
      Blocked: 0,
      Completed: 0
    };

    this.tasks().forEach(task => {
      if (statusCounts[task.status] !== undefined) {
        statusCounts[task.status]++;
      }
    });

    const chartData: TaskStatusData[] = Object.entries(statusCounts)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        status: status as TaskStatus,
        count
      }));

    this.chartData.set(chartData);
  }

  onFiltersChange(filters: TaskFilters) {
    this.currentFilters.set(filters);
    this.currentPage.set(1);
    this.loadTasks();
  }

  onPageChange(event: { page: number; pageSize: number }) {
    this.currentPage.set(event.page);
    this.pageSize.set(event.pageSize);
    this.loadTasks();
  }

  onTaskClick(task: Task) {
    this.dialog.open(TaskDetailComponent, {
      data: task,
      width: '600px',
      maxWidth: '90vw'
    });
  }

  navigateToNewTask() {
    this.router.navigate(['/tasks/new'], { queryParams: { projectId: this.projectId() } });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  completedCount() {
    return this.tasks()?.filter(t => t.status === 'Completed').length ?? 0;
  }

}
