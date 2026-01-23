import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
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
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent<T = any> {
  @Input() columns: TableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() highlightRow?: (row: T) => boolean;

  @Output() rowClick = new EventEmitter<T>();
  @Output() sortChange = new EventEmitter<Sort>();

  get displayedColumns(): string[] {
    return this.columns.map(col => col.key);
  }

  onRowClick(row: T): void {
    this.rowClick.emit(row);
  }

  onSortChange(sort: Sort): void {
    this.sortChange.emit(sort);
  }

  getCellValue(row: T, column: TableColumn<T>): string {
    const value = this.getNestedValue(row, column.key);
    return column.format ? column.format(value, row) : value;
  }

  getCellClass(row: T, column: TableColumn<T>): string {
    const value = this.getNestedValue(row, column.key);
    return column.cssClass ? column.cssClass(value, row) : '';
  }

  getRowClass(row: T): string {
    return this.highlightRow && this.highlightRow(row) ? 'highlighted-row' : '';
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }
}
