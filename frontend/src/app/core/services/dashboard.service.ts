import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { 
  ApiResponse, 
  DeveloperDelayRisk, 
  DeveloperWorkload, 
  ProjectHealth 
} from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;

  // Carga de trabajo de los desarrolladores
  getDeveloperWorkload(): Observable<DeveloperWorkload[]> {
    return this.http.get<ApiResponse<DeveloperWorkload[]>>(
      `${this.apiUrl}/developer-workload`
    ).pipe(
      map(response => response.data || [])
    );
  }

  // Salud de los proyectos
  getProjectHealth(): Observable<ProjectHealth[]> {
    return this.http.get<ApiResponse<ProjectHealth[]>>(
      `${this.apiUrl}/project-health`
    ).pipe(
      map(response => response.data || [])
    );
  }

  // Riesgo de retraso de desarrolladores
  getDeveloperDelayRisk(): Observable<DeveloperDelayRisk[]> {
    return this.http.get<ApiResponse<DeveloperDelayRisk[]>>(
      `${this.apiUrl}/developer-delay-risk`
    ).pipe(
      map(response => response.data || [])
    );
  }
}
