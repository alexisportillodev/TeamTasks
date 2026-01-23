export interface Project {
  projectId: number;
  name: string;
  clientName: string;
  startDate: string;
  endDate?: string;
  status: ProjectStatus;
}

export interface ProjectWithStats extends Project {
  totalTasks: number;
  openTasks: number;
  completedTasks: number;
}

export type ProjectStatus = 'Planned' | 'InProgress' | 'Completed';
