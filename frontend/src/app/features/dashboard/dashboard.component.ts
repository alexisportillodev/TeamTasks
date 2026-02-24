import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { DashboardService } from '@core/services';
import { DeveloperWorkload, ProjectHealth, DeveloperDelayRisk } from '@core/models';
import { DataTableComponent, TableColumn } from '@shared/components/data-table/data-table.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { fadeInAnimation, fadeInListAnimation } from '@shared/animations/fade-in.animation';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    DataTableComponent,
    LoadingSpinnerComponent,

  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [fadeInAnimation, fadeInListAnimation]
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);

  // Signals para estado reactivo
  loading = signal(true);
  error = signal<string | null>(null);
  
  // Workload pagination
  workloadData = signal<DeveloperWorkload[]>([]);
  workloadPage = signal(1);
  workloadPageSize = signal(5);
  workloadTotal = signal(0);

  // Project health pagination
  projectHealthData = signal<ProjectHealth[]>([]);
  projectHealthPage = signal(1);
  projectHealthPageSize = signal(5);
  projectHealthTotal = signal(0);

  // Delay risk pagination
  delayRiskData = signal<DeveloperDelayRisk[]>([]);
  delayRiskPage = signal(1);
  delayRiskPageSize = signal(10);
  delayRiskTotal = signal(0);

  // Columnas
  workloadColumns: TableColumn<DeveloperWorkload>[] = [
    { key: 'developerName', label: 'Desarrollador', sortable: true },
    { key: 'openTasksCount', label: 'Tareas Abiertas', sortable: true, cssClass: () => 'text-center' },
    {
      key: 'averageEstimatedComplexity',
      label: 'Complejidad Promedio',
      sortable: true,
      format: (v) => v ? v.toFixed(2) : '0.00',
      cssClass: () => 'text-center'
    }
  ];

  projectHealthColumns: TableColumn<ProjectHealth>[] = [
    { key: 'projectName', label: 'Proyecto', sortable: true },

    { key: 'totalTasks', label: 'Total', sortable: true, cssClass: () => 'text-center' },

    {
      key: 'openTasks',
      label: 'Abiertas',
      sortable: true,
      format: v => v,
      cssClass: v => v > 0 ? 'badge badge-open' : 'badge badge-completed'
    },

    {
      key: 'completedTasks',
      label: 'Completadas',
      sortable: true,
      format: v => v,
      cssClass: () => 'badge badge-completed'
    }
  ];

  delayRiskColumns: TableColumn<DeveloperDelayRisk>[] = [
    { key: 'developerName', label: 'Desarrollador', sortable: true },

    { key: 'openTasksCount', label: 'Abiertas', sortable: true, cssClass: () => 'text-center' },

    {
      key: 'avgDelayDays',
      label: 'Retraso Promedio (días)',
      sortable: true,
      format: v => v ? v.toFixed(1) : '0.0',
      cssClass: () => 'text-center'
    },

    {
      key: 'nearestDueDate',
      label: 'Próximo vencimiento',
      format: v => v ? new Date(v).toLocaleDateString() : 'N/A'
    },

    {
      key: 'latestDueDate',
      label: 'Último vencimiento',
      format: v => v ? new Date(v).toLocaleDateString() : 'N/A'
    },

    {
      key: 'predictedCompletionDate',
      label: 'Fecha estimada',
      format: v => v ? new Date(v).toLocaleDateString() : 'N/A'
    },

    {
      key: 'highRiskFlag',
      label: 'Riesgo',
      format: v => v === 1 ? 'ALTO' : 'NORMAL',
      cssClass: v => v === 1 ? 'badge badge-risk' : 'badge badge-completed'
    }
  ];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      workload: this.dashboardService.getDeveloperWorkload(this.workloadPage(), this.workloadPageSize()),
      health: this.dashboardService.getProjectHealth(this.projectHealthPage(), this.projectHealthPageSize()),
      risk: this.dashboardService.getDeveloperDelayRisk(this.delayRiskPage(), this.delayRiskPageSize())
    }).subscribe({
      next: ({ workload, health, risk }) => {
        this.workloadData.set(workload?.items || []);
        this.workloadTotal.set(workload?.totalCount || 0);
        this.workloadPage.set(workload?.page || this.workloadPage());
        this.workloadPageSize.set(workload?.pageSize || this.workloadPageSize());

        this.projectHealthData.set(health?.items || []);
        this.projectHealthTotal.set(health?.totalCount || 0);
        this.projectHealthPage.set(health?.page || this.projectHealthPage());
        this.projectHealthPageSize.set(health?.pageSize || this.projectHealthPageSize());

        this.delayRiskData.set(risk?.items || []);
        this.delayRiskTotal.set(risk?.totalCount || 0);
        this.delayRiskPage.set(risk?.page || this.delayRiskPage());
        this.delayRiskPageSize.set(risk?.pageSize || this.delayRiskPageSize());

        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message || 'Error al cargar los datos');
        this.loading.set(false);
      }
    });
  }

  loadWorkload(page: number = this.workloadPage(), pageSize: number = this.workloadPageSize()): void {
    this.loading.set(true);
    this.dashboardService.getDeveloperWorkload(page, pageSize).subscribe({
      next: (res) => {
        this.workloadData.set(res.items);
        this.workloadTotal.set(res.totalCount);
        this.workloadPage.set(res.page);
        this.workloadPageSize.set(res.pageSize);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message || 'Error al cargar workload');
        this.loading.set(false);
      }
    });
  }

  loadProjectHealth(page: number = this.projectHealthPage(), pageSize: number = this.projectHealthPageSize()): void {
    this.loading.set(true);
    this.dashboardService.getProjectHealth(page, pageSize).subscribe({
      next: (res) => {
        this.projectHealthData.set(res.items);
        this.projectHealthTotal.set(res.totalCount);
        this.projectHealthPage.set(res.page);
        this.projectHealthPageSize.set(res.pageSize);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message || 'Error al cargar project health');
        this.loading.set(false);
      }
    });
  }

  loadDelayRisk(page: number = this.delayRiskPage(), pageSize: number = this.delayRiskPageSize()): void {
    this.loading.set(true);
    this.dashboardService.getDeveloperDelayRisk(page, pageSize).subscribe({
      next: (res) => {
        this.delayRiskData.set(res.items);
        this.delayRiskTotal.set(res.totalCount);
        this.delayRiskPage.set(res.page);
        this.delayRiskPageSize.set(res.pageSize);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message || 'Error al cargar delay risk');
        this.loading.set(false);
      }
    });
  }

  onWorkloadPageChange(event: { page: number; pageSize: number }): void {
    this.workloadPage.set(event.page);
    this.workloadPageSize.set(event.pageSize);
    this.loadWorkload(event.page, event.pageSize);
  }

  onProjectHealthPageChange(event: { page: number; pageSize: number }): void {
    this.projectHealthPage.set(event.page);
    this.projectHealthPageSize.set(event.pageSize);
    this.loadProjectHealth(event.page, event.pageSize);
  }

  onDelayRiskPageChange(event: { page: number; pageSize: number }): void {
    this.delayRiskPage.set(event.page);
    this.delayRiskPageSize.set(event.pageSize);
    this.loadDelayRisk(event.page, event.pageSize);
  }

  // Resaltado de filas
  highlightUnhealthyProjects = (row: ProjectHealth) => row.openTasks > row.completedTasks;
  highlightHighRisk = (row: DeveloperDelayRisk) => row.highRiskFlag === 1;

  onSort<T>(dataSignal: { (): T[]; set: (value: T[]) => void }, sort: { active: string; direction: 'asc' | 'desc' | '' }) {
    const data = [...dataSignal()]; // data es T[]
    if (!sort.active || sort.direction === '') return;

    const isAsc = sort.direction === 'asc';
    data.sort((a: any, b: any) => (a[sort.active] < b[sort.active] ? -1 : 1) * (isAsc ? 1 : -1));

    dataSignal.set(data); // ahora TypeScript sabe que data es del mismo tipo T[]
  }

  onProjectClick(project: any): void {
    // Necesitamos obtener el projectId del backend
    // Por ahora navegamos con el índice + 1 (asumiendo IDs secuenciales)
    const projectIndex = this.projectHealthData().findIndex(
      p => p.projectName === project.projectName
    );
    const projectId = projectIndex + 1; // Temporal: IDs son 1, 2, 3
    this.router.navigate(['/projects', projectId, 'tasks']);
  }

  navigateToNewTask() {
    this.router.navigate(['/tasks/new']);
  }

  // Dentro de DashboardComponent
  onWorkloadSort(sort: any) {
    this.onSort(this.workloadData, sort);
  }

  onProjectHealthSort(sort: any) {
    this.onSort(this.projectHealthData, sort);
  }

  onDelayRiskSort(sort: any) {
    this.onSort(this.delayRiskData, sort);
  }

  totalTasks() {
    return this.workloadData().reduce((acc, d) => acc + d.openTasksCount, 0);
  }

  riskyDevsCount() {
    return this.delayRiskData()
      ?.filter(d => d.highRiskFlag === 1).length ?? 0;
  }

  efficiency() {
    if (!this.projectHealthData()?.length) return 0;

    const total = this.projectHealthData()
      .reduce((acc, p) => acc + p.completedTasks + p.openTasks, 0);

    const completed = this.projectHealthData()
      .reduce((acc, p) => acc + p.completedTasks, 0);

    return total ? Math.round((completed / total) * 100) : 0;
  }
}
