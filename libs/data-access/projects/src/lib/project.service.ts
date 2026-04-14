import { Injectable, inject } from '@angular/core';
import { from, Observable } from 'rxjs';
import { SupabaseService } from '@devboard/data-access-auth';
import type { Project, CreateProjectDto, UpdateProjectDto } from '@devboard/shared-models';
import { ProjectServiceBase } from './project-service.base';

@Injectable()
export class ProjectService extends ProjectServiceBase {
  private supabase = inject(SupabaseService);

  getAll(): Observable<Project[]> {
    return from(
      this.supabase.client
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) throw error;
          return (data ?? []) as Project[];
        }),
    );
  }

  getById(id: string): Observable<Project> {
    return from(
      this.supabase.client
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data as Project;
        }),
    );
  }

  create(dto: CreateProjectDto): Observable<Project> {
    return from(
      this.supabase.client
        .from('projects')
        .insert(dto)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data as Project;
        }),
    );
  }

  update(id: string, dto: UpdateProjectDto): Observable<Project> {
    return from(
      this.supabase.client
        .from('projects')
        .update({ ...dto, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data as Project;
        }),
    );
  }

  delete(id: string): Observable<void> {
    return from(
      this.supabase.client
        .from('projects')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
        }),
    );
  }
}
