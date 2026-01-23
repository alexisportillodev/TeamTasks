import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { ApiResponse, CreateTaskDto, Task, UpdateTaskStatusDto } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  // Crear una tarea
  createTask(taskDto: CreateTaskDto): Observable<Task> {
    return this.http.post<ApiResponse<Task>>(this.apiUrl, taskDto).pipe(
      map(response => response.data!)
    );
  }

  // Actualizar el estado de una tarea
  updateTaskStatus(taskId: number, updateDto: UpdateTaskStatusDto): Observable<Task> {
    return this.http.put<ApiResponse<Task>>(
      `${this.apiUrl}/${taskId}/status`,
      updateDto
    ).pipe(
      map(response => response.data!)
    );
  }

  // Obtener una tarea por id (opcional, útil)
  getTaskById(taskId: number): Observable<Task> {
    return this.http.get<ApiResponse<Task>>(`${this.apiUrl}/${taskId}`).pipe(
      map(response => response.data!)
    );
  }
}
