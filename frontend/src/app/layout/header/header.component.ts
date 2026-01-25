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
  title = 'Team Tasks';

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.resolveTitle());
    
    this.resolveTitle();
  }

  private resolveTitle() {
    let route = this.router.routerState.root;

    while (route?.firstChild) {
      route = route.firstChild;
    }

    this.title = route?.snapshot?.data?.['title'] || 'Team Tasks';
  }

}
