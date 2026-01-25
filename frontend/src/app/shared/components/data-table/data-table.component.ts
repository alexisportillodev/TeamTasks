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

import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';

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

  @Input() columns: TableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() highlightRow?: (row: T) => boolean;
  @Input() pageSize = 5;

  @Output() rowClick = new EventEmitter<T>();
  @Output() sortChange = new EventEmitter<Sort>();

  dataSource = new MatTableDataSource<T>([]);
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']) {
      this.displayedColumns = this.columns.map(c => c.key);
    }

    if (changes['data']) {
      this.dataSource.data = this.data ?? [];
      if (this.paginator) {
        this.paginator.firstPage();
      }
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
