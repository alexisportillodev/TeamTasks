import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  {
    path: 'projects/:id/tasks',
    loadComponent: () => import('./features/projects/components/project-tasks/project-tasks.component')
      .then(m => m.ProjectTasksComponent)
  },
  {
    path: 'tasks/new',
    loadComponent: () => import('./features/tasks/components/task-form/task-form.component')
      .then(m => m.TaskFormComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
