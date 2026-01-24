export interface DeveloperWorkload {
  developerName: string;
  openTasksCount: number;
  averageEstimatedComplexity: number;
}

export interface ProjectHealth {
  projectName: string;
  totalTasks: number;
  openTasks: number;
  completedTasks: number;
}

export interface DeveloperDelayRisk {
  developerName: string;
  openTasksCount: number;
  avgDelayDays: number;
  nearestDueDate?: string;
  latestDueDate?: string;
  predictedCompletionDate?: string;
  highRiskFlag: number;
}
