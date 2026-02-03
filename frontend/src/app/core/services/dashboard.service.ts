import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { 
  ApiResponse, 
  DeveloperDelayRisk, 
  DeveloperWorkload, 
  ProjectHealth,
  PagedResult
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;

  // Carga de trabajo de los desarrolladores (paginado)
  getDeveloperWorkload(page: number = 1, pageSize: number = 10): Observable<PagedResult<DeveloperWorkload>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PagedResult<DeveloperWorkload>>>(
      `${this.apiUrl}/developer-workload`, { params }
    ).pipe(
      map(response => response.data!)
    );
  }

  // Salud de los proyectos (paginado)
  getProjectHealth(page: number = 1, pageSize: number = 10): Observable<PagedResult<ProjectHealth>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PagedResult<ProjectHealth>>>(
      `${this.apiUrl}/project-health`, { params }
    ).pipe(
      map(response => response.data!)
    );
  }

  // Riesgo de retraso de desarrolladores (paginado)
  getDeveloperDelayRisk(page: number = 1, pageSize: number = 10): Observable<PagedResult<DeveloperDelayRisk>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PagedResult<DeveloperDelayRisk>>>(
      `${this.apiUrl}/developer-delay-risk`, { params }
    ).pipe(
      map(response => response.data!)
    );
  }
}
