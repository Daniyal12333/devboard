import { Observable } from 'rxjs';
import type { Project, CreateProjectDto, UpdateProjectDto } from '@devboard/shared-models';

export abstract class ProjectServiceBase {
  abstract getAll(): Observable<Project[]>;
  abstract getById(id: string): Observable<Project>;
  abstract create(dto: CreateProjectDto): Observable<Project>;
  abstract update(id: string, dto: UpdateProjectDto): Observable<Project>;
  abstract delete(id: string): Observable<void>;
}
