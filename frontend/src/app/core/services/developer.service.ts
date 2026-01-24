import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { ApiResponse, Developer } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class DeveloperService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/developers`;

  // Devuelve un array de Developer
  getAllDevelopers(): Observable<Developer[]> {
    return this.http.get<ApiResponse<Developer[]>>(this.apiUrl).pipe(
      map(response => response.data || [])
    );
  }

  // Devuelve un solo Developer
  getDeveloperById(id: number): Observable<Developer> {
    return this.http.get<ApiResponse<Developer>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data!)
    );
  }
}
