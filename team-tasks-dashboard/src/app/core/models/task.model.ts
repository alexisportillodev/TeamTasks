export interface Task {
  taskId: number;
  projectId: number;
  projectName: string;
  title: string;
  description?: string;
  assigneeId?: number;
  assigneeName?: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedComplexity?: number;
  dueDate: string;
  completionDate?: string;
  createdAt: string;
}

export interface CreateTaskDto {
  projectId: number;
  title: string;
  description?: string;
  assigneeId?: number;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedComplexity?: number;
  dueDate: string;
}

export interface UpdateTaskStatusDto {
  status: TaskStatus;
  priority?: TaskPriority;
  estimatedComplexity?: number;
}

export type TaskStatus = 'ToDo' | 'InProgress' | 'Blocked' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';
