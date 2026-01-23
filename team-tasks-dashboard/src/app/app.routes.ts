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
  // {
  //   path: 'projects', // lista de proyectos
  //   loadComponent: () => import('./features/projects/components/project-list/project-list.component')
  //     .then(m => m.ProjectListComponent)
  // },
  {
    path: 'projects/:id/tasks', // tareas de un proyecto
    loadComponent: () => import('./features/projects/components/project-tasks/project-tasks.component')
      .then(m => m.ProjectTasksComponent)
  },
  // {
  //   path: 'tasks', // tareas generales
  //   loadComponent: () => import('./features/tasks/components/task-list/task-list.component')
  //     .then(m => m.TaskListComponent)
  // },
  // {
  //   path: 'developers', // lista de desarrolladores
  //   loadComponent: () => import('./features/developers/components/developer-list/developer-list.component')
  //     .then(m => m.DeveloperListComponent)
  // },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
