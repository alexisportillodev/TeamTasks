import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatToolbarModule],
  template: `
    
      &copy; {{ currentYear }} Team Tasks Dashboard - Proyecto Educativo
      
        Desarrollado con Angular 18 + .NET 8 + PostgreSQL
      
    
  `,
  styles: [`
    .app-footer {
      background-color: #263238;
      color: #b0bec5;
      padding: 24px;
      text-align: center;
      margin-top: auto;

      p {
        margin: 4px 0;
        font-size: 14px;
      }

      .tech-stack {
        font-size: 12px;
        color: #78909c;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
