import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DashboardComponent } from './features/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    DashboardComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Team Tasks Dashboard';
  private readonly router = inject(Router);

  navigateDashboard() {
    this.router.navigate(['/dashboard']);
  }

  navigateProjects() {
    this.router.navigate(['/projects']);
  }

  navigateTasks() {
    this.router.navigate(['/tasks']);
  }

  navigateDevelopers() {
    this.router.navigate(['/developers']);
  }
}
