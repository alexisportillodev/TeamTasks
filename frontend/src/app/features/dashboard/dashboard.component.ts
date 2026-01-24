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
    LoadingSpinnerComponent
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
  
  workloadData = signal<DeveloperWorkload[]>([]);
  projectHealthData = signal<ProjectHealth[]>([]);
  delayRiskData = signal<DeveloperDelayRisk[]>([]);

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
      workload: this.dashboardService.getDeveloperWorkload(),
      health: this.dashboardService.getProjectHealth(),
      risk: this.dashboardService.getDeveloperDelayRisk()
    }).subscribe({
      next: ({ workload, health, risk }) => {
        this.workloadData.set(workload || []);
        this.projectHealthData.set(health || []);
        this.delayRiskData.set(risk || []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message || 'Error al cargar los datos');
        this.loading.set(false);
      }
    });
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
    return this.workloadData()
      ?.reduce((acc, d) => acc + d.openTasksCount, 0) ?? 0;
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
