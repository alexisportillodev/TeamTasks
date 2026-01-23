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
  styleUrls: ['./dashboard.component.scss']
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
    { key: 'openTasksCount', label: 'Tareas Abiertas', sortable: true },
    { key: 'averageEstimatedComplexity', label: 'Complejidad Promedio', sortable: true, 
      format: (v) => v ? v.toFixed(2) : '0.00' }
  ];

  projectHealthColumns: TableColumn<ProjectHealth>[] = [
    { key: 'projectName', label: 'Proyecto', sortable: true },
    { key: 'totalTasks', label: 'Total Tareas', sortable: true },
    { key: 'openTasks', label: 'Abiertas', sortable: true, 
      cssClass: (v) => v > 0 ? 'status-inprogress' : '' },
    { key: 'completedTasks', label: 'Completadas', sortable: true, 
      cssClass: () => 'status-completed' }
  ];

  delayRiskColumns: TableColumn<DeveloperDelayRisk>[] = [
    { key: 'developerName', label: 'Desarrollador', sortable: true },
    { key: 'openTasksCount', label: 'Tareas Abiertas', sortable: true },
    { key: 'avgDelayDays', label: 'Retraso Promedio (días)', sortable: true, 
      format: (v) => v ? v.toFixed(1) : '0.0' },
    { key: 'nearestDueDate', label: 'Próximo Vencimiento', 
      format: (v) => v ? new Date(v).toLocaleDateString() : 'N/A' },
    { key: 'latestDueDate', label: 'Último Vencimiento', 
      format: (v) => v ? new Date(v).toLocaleDateString() : 'N/A' },
    { key: 'predictedCompletionDate', label: 'Fecha Estimada', 
      format: (v) => v ? new Date(v).toLocaleDateString() : 'N/A' },
    { key: 'highRiskFlag', label: 'Riesgo', 
      format: (v) => v === 1 ? 'Alto' : 'Normal',
      cssClass: (v) => v === 1 ? 'risk-high' : 'risk-normal' }
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

  onProjectClick(project: ProjectHealth) {
    console.log('Project clicked:', project);
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
}
