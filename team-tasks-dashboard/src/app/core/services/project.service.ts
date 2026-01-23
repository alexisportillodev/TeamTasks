import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { ApiResponse, PagedResult, Project, ProjectWithStats, Task, TaskStatus } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/projects`;

  // Devuelve todos los proyectos
  getAllProjects(): Observable<Project[]> {
    return this.http.get<ApiResponse<Project[]>>(this.apiUrl).pipe(
      map(response => response.data || [])
    );
  }

  // Devuelve un proyecto por id
  getProjectById(id: number): Observable<Project> {
    return this.http.get<ApiResponse<Project>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data!)
    );
  }

  // Devuelve las tareas de un proyecto con paginación
  getProjectTasks(
    projectId: number,
    page: number = 1,
    pageSize: number = 10,
    status?: TaskStatus,
    assigneeId?: number
  ): Observable<PagedResult<Task>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (status) {
      params = params.set('status', status);
    }

    if (assigneeId) {
      params = params.set('assigneeId', assigneeId.toString());
    }

    return this.http.get<ApiResponse<PagedResult<Task>>>(
      `${this.apiUrl}/${projectId}/tasks`,
      { params }
    ).pipe(
      map(response => response.data!)
    );
  }

  // Ejemplo: proyectos con estadísticas
  getProjectsWithStats(): Observable<ProjectWithStats[]> {
    return this.http.get<ApiResponse<ProjectWithStats[]>>(`${this.apiUrl}/stats`).pipe(
      map(response => response.data || [])
    );
  }
}
