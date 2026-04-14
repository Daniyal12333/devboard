import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { Project, CreateProjectDto, UpdateProjectDto } from '@devboard/shared-models';
import { ProjectServiceBase } from './project-service.base';

interface ProjectState {
  projects: Project[];
  selectedProjectId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  selectedProjectId: null,
  loading: false,
  error: null,
};

export const ProjectStore = signalStore(
  { providedIn: 'root' },
  withState<ProjectState>(initialState),
  withComputed(({ projects, selectedProjectId }) => ({
    selectedProject: computed(() =>
      projects().find((p) => p.id === selectedProjectId()) ?? null,
    ),
    projectCount: computed(() => projects().length),
    activeProjects: computed(() =>
      projects().filter((p) => p.status === 'active'),
    ),
  })),
  withMethods((store, projectService = inject(ProjectServiceBase)) => ({
    async loadProjects(): Promise<void> {
      patchState(store, { loading: true, error: null });
      try {
        const projects = await firstValueFrom(projectService.getAll());
        patchState(store, { projects, loading: false });
      } catch (err) {
        patchState(store, {
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load projects',
        });
      }
    },

    async createProject(dto: CreateProjectDto): Promise<Project | null> {
      patchState(store, { loading: true, error: null });
      try {
        const project = await firstValueFrom(projectService.create(dto));
        patchState(store, (s) => ({
          projects: [project, ...s.projects],
          loading: false,
        }));
        return project;
      } catch (err) {
        patchState(store, {
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to create project',
        });
        return null;
      }
    },

    async updateProject(id: string, dto: UpdateProjectDto): Promise<void> {
      patchState(store, { loading: true, error: null });
      try {
        const updated = await firstValueFrom(projectService.update(id, dto));
        patchState(store, (s) => ({
          projects: s.projects.map((p) => (p.id === id ? updated : p)),
          loading: false,
        }));
      } catch (err) {
        patchState(store, {
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to update project',
        });
      }
    },

    async deleteProject(id: string): Promise<void> {
      patchState(store, { loading: true, error: null });
      try {
        await firstValueFrom(projectService.delete(id));
        patchState(store, (s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          selectedProjectId:
            s.selectedProjectId === id ? null : s.selectedProjectId,
          loading: false,
        }));
      } catch (err) {
        patchState(store, {
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to delete project',
        });
      }
    },

    selectProject(id: string | null): void {
      patchState(store, { selectedProjectId: id });
    },
  })),
);
