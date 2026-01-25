import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./layout/layout/layout.component')
        .then(m => m.LayoutComponent),
    children: [

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent),
        data: { title: 'Dashboard' }
      },
      {
        path: 'projects/:id/tasks',
        loadComponent: () => import('./features/projects/components/project-tasks/project-tasks.component')
          .then(m => m.ProjectTasksComponent),
        data: { title: 'Tareas por proyecto' }
      },
      {
        path: 'tasks/new',
        loadComponent: () => import('./features/tasks/components/task-form/task-form.component')
          .then(m => m.TaskFormComponent),
        data: { title: 'Nueva tarea' }
      }

    ]
  },

  { path: '**', redirectTo: '' }
];
