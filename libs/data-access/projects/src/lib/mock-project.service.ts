import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import type { Project, CreateProjectDto, UpdateProjectDto } from '@devboard/shared-models';
import { MOCK_PROJECTS, MOCK_USER_ID } from '@devboard/shared-models';
import { ProjectServiceBase } from './project-service.base';

@Injectable()
export class MockProjectService extends ProjectServiceBase {
  private projects: Project[] = structuredClone(MOCK_PROJECTS);

  getAll(): Observable<Project[]> {
    const sorted = [...this.projects].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
    return of(sorted).pipe(delay(300));
  }

  getById(id: string): Observable<Project> {
    const project = this.projects.find((p) => p.id === id);
    if (!project) return throwError(() => new Error(`Project ${id} not found`));
    return of({ ...project }).pipe(delay(150));
  }

  create(dto: CreateProjectDto): Observable<Project> {
    const now = new Date().toISOString();
    const project: Project = {
      id: `proj-${crypto.randomUUID()}`,
      name: dto.name,
      description: dto.description ?? null,
      status: dto.status ?? 'active',
      owner_id: MOCK_USER_ID,
      created_at: now,
      updated_at: now,
    };
    this.projects = [project, ...this.projects];
    return of({ ...project }).pipe(delay(300));
  }

  update(id: string, dto: UpdateProjectDto): Observable<Project> {
    const idx = this.projects.findIndex((p) => p.id === id);
    if (idx === -1) return throwError(() => new Error(`Project ${id} not found`));

    const updated: Project = {
      ...this.projects[idx],
      ...dto,
      updated_at: new Date().toISOString(),
    };
    this.projects = this.projects.map((p) => (p.id === id ? updated : p));
    return of({ ...updated }).pipe(delay(300));
  }

  delete(id: string): Observable<void> {
    this.projects = this.projects.filter((p) => p.id !== id);
    return of(undefined).pipe(delay(300));
  }
}
