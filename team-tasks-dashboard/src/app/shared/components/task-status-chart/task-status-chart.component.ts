import { Component, Input, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

export interface TaskStatusData {
  status: 'ToDo' | 'InProgress' | 'Blocked' | 'Completed';
  count: number;
}

@Component({
  selector: 'app-task-status-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './task-status-chart.component.html',
  styleUrls: ['./task-status-chart.component.scss']
})
export class TaskStatusChartComponent implements OnInit {

  @Input({ required: true }) data: TaskStatusData[] = [];

  chartType: ChartType = 'pie';

  chartData = signal<ChartData<'pie', number[], string>>({
    labels: [],
    datasets: []
  });

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: { size: 12 }
        }
      },
      tooltip: {
        callbacks: {
          label: context => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = total ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  constructor() {
    effect(() => {
      this.updateChartData();
    });
  }

  ngOnInit(): void {
    this.updateChartData();
  }

  private updateChartData(): void {
    if (!this.data?.length) {
      this.chartData.set({ labels: [], datasets: [] });
      return;
    }

    const labels = this.data.map(d => this.getStatusLabel(d.status));
    const values = this.data.map(d => d.count);
    const colors = this.data.map(d => this.getStatusColor(d.status));

    this.chartData.set({
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: colors.map(c => this.darkenColor(c)),
          borderWidth: 2
        }
      ]
    });
  }

  private getStatusLabel(status: TaskStatusData['status']): string {
    const map: Record<TaskStatusData['status'], string> = {
      ToDo: 'Por hacer',
      InProgress: 'En progreso',
      Blocked: 'Bloqueadas',
      Completed: 'Completadas'
    };
    return map[status];
  }

  private getStatusColor(status: TaskStatusData['status']): string {
    const map: Record<TaskStatusData['status'], string> = {
      ToDo: '#9e9e9e',
      InProgress: '#2196f3',
      Blocked: '#f44336',
      Completed: '#4caf50'
    };
    return map[status];
  }

  private darkenColor(color: string): string {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - 40);
    const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - 40);
    const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - 40);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
}
