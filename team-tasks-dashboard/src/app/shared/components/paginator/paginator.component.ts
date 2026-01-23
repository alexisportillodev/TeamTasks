import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  template: `
    
    
  `,
  styles: [`
    mat-paginator {
      background: transparent;
    }
  `]
})
export class PaginatorComponent {
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Input() pageSizeOptions = [5, 10, 25, 50];
  @Output() pageChange = new EventEmitter();

  onPageChange(event: PageEvent): void {
    this.pageChange.emit({
      page: event.pageIndex + 1,
      pageSize: event.pageSize
    });
  }
}
