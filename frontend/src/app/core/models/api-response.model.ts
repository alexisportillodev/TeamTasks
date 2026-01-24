export class ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];

  constructor(
    success: boolean,
    data?: T,
    message?: string,
    errors?: string[]
  ) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.errors = errors;
  }
}

export class PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;

  constructor(items: T[], totalCount: number, page: number, pageSize: number) {
    this.items = items;
    this.totalCount = totalCount;
    this.page = page;
    this.pageSize = pageSize;
    this.totalPages = Math.ceil(totalCount / pageSize);
  }
}
