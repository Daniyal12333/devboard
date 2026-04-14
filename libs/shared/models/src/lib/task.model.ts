export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  project_id: string;
  column_id: string | null;
  title: string;
  description: string | null;
  priority: TaskPriority;
  assignee_id: string | null;
  reporter_id: string;
  due_date: string | null;
  position: number;
  labels: string[];
  created_at: string;
  updated_at: string;
}

export type CreateTaskDto = Pick<
  Task,
  'title' | 'description' | 'priority' | 'assignee_id' | 'due_date' | 'labels' | 'project_id' | 'column_id'
>;
