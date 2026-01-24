import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  private router = inject(Router);
  title = 'Dashboard';

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.setTitle();
      });

    this.setTitle();
  }

  private setTitle() {
    const url = this.router.url;

    if (url.includes('dashboard')) this.title = 'Dashboard';
    else if (url.includes('projects')) this.title = 'Tareas por proyecto';
    else if (url.includes('tasks/new')) this.title = 'Nueva tarea';
    else this.title = 'Team Tasks';
  }
}
