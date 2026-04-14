export type ProjectStatus = 'active' | 'archived' | 'completed';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export type CreateProjectDto = Pick<Project, 'name' | 'description' | 'status'>;
export type UpdateProjectDto = Partial<CreateProjectDto>;
