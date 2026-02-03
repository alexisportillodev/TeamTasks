import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  format?: (value: any, row: T) => string;
  cssClass?: (value: any, row: T) => string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent<T = any>
  implements AfterViewInit, OnChanges {

  // --------------------------
  // Inputs
  // --------------------------

  @Input() columns: TableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() highlightRow?: (row: T) => boolean;

  @Input() pageSize = 10;
  @Input() currentPage = 1;      // backend page (1-based)
  @Input() totalLength = 0;      // total items from backend
  @Input() showPaginator = true;

  // --------------------------
  // Outputs
  // --------------------------

  @Output() rowClick = new EventEmitter<T>();
  @Output() sortChange = new EventEmitter<Sort>();
  @Output() pageChange = new EventEmitter<{ page: number; pageSize: number }>();

  // --------------------------
  // Table state
  // --------------------------

  dataSource = new MatTableDataSource<T>([]);
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private viewInitialized = false;

  // --------------------------
  // Lifecycle
  // --------------------------

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['columns']) {
      this.displayedColumns = this.columns.map(c => c.key);
    }

    if (changes['data']) {
      this.dataSource.data = this.data ?? [];
    }

    if (
      changes['currentPage'] ||
      changes['pageSize'] ||
      changes['totalLength']
    ) {
      this.syncPaginator();
    }

    if (this.viewInitialized) {
      this.attachControls();
    }
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.attachControls();
    this.syncPaginator();
  }

  // --------------------------
  // Attach sort (NO paginator datasource)
  // --------------------------

  private attachControls(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }

    // server-side pagination → Angular Material no pagina
    this.dataSource.paginator = null;
  }

  // --------------------------
  // Sync visual paginator
  // --------------------------

  private syncPaginator(): void {
    if (!this.paginator) return;

    this.paginator.length = this.totalLength;
    this.paginator.pageSize = this.pageSize;
    this.paginator.pageIndex = Math.max(this.currentPage - 1, 0);
  }

  // --------------------------
  // Events
  // --------------------------

  onRowClick(row: T): void {
    this.rowClick.emit(row);
  }

  onSortChange(sort: Sort): void {
    this.sortChange.emit(sort);
  }

  onInternalPageChange(event: PageEvent): void {
    this.pageChange.emit({
      page: event.pageIndex + 1,
      pageSize: event.pageSize
    });
  }

  // --------------------------
  // Helpers
  // --------------------------

  getCellValue(row: T, column: TableColumn<T>): string {
    const value = this.getNestedValue(row, column.key);
    return column.format ? column.format(value, row) : value;
  }

  getCellClass(row: T, column: TableColumn<T>): string {
    const value = this.getNestedValue(row, column.key);
    return column.cssClass ? column.cssClass(value, row) : '';
  }

  getRowClass(row: T): string {
    return this.highlightRow && this.highlightRow(row)
      ? 'highlighted-row'
      : '';
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }
}
