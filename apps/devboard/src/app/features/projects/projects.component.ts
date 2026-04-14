import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ProjectStore } from '@devboard/data-access-projects';
import type { Project } from '@devboard/shared-models';
import { ProjectCardComponent } from './project-card.component';
import { ProjectFormComponent, ProjectFormValue } from './project-form.component';

@Component({
  selector: 'db-projects',
  standalone: true,
  imports: [ProjectCardComponent, ProjectFormComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-[var(--color-text)]">Projects</h1>
          <p class="mt-1 text-sm text-[var(--color-text-secondary)]">
            {{ projectStore.projectCount() }} project{{ projectStore.projectCount() === 1 ? '' : 's' }}
          </p>
        </div>
        <button
          type="button"
          (click)="openCreate()"
          class="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)]"
        >
          <span aria-hidden="true">+</span>
          New Project
        </button>
      </div>

      <!-- Error -->
      @if (projectStore.error()) {
        <div
          class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {{ projectStore.error() }}
        </div>
      }

      <!-- Project grid -->
      @if (projectStore.loading() && projectStore.projectCount() === 0) {
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (i of [1, 2, 3]; track i) {
            <div
              class="animate-pulse rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            >
              <div class="h-5 w-3/4 rounded bg-[var(--color-surface-secondary)]"></div>
              <div class="mt-2 h-4 w-full rounded bg-[var(--color-surface-secondary)]"></div>
              <div class="mt-1 h-4 w-2/3 rounded bg-[var(--color-surface-secondary)]"></div>
            </div>
          }
        </div>
      } @else if (projectStore.projectCount() === 0) {
        <div
          class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-border)] p-12 text-center"
        >
          <span class="text-4xl" aria-hidden="true">📁</span>
          <h3 class="mt-3 text-base font-medium text-[var(--color-text)]">
            No projects yet
          </h3>
          <p class="mt-1 text-sm text-[var(--color-text-secondary)]">
            Create your first project to get started.
          </p>
          <button
            type="button"
            (click)="openCreate()"
            class="mt-4 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)]"
          >
            Create Project
          </button>
        </div>
      } @else {
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (project of projectStore.projects(); track project.id) {
            <db-project-card
              [project]="project"
              (edit)="openEdit($event)"
              (deleteProject)="confirmDelete($event)"
            />
          }
        </div>
      }
    </div>

    <!-- Create/Edit modal -->
    @if (showModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <button
          type="button"
          class="absolute inset-0 bg-black/50"
          (click)="closeModal()"
          aria-label="Close modal"
        ></button>
        <div
          class="relative w-full max-w-md rounded-xl bg-[var(--color-surface)] p-6 shadow-xl"
        >
          <h2 class="mb-4 text-lg font-semibold text-[var(--color-text)]">
            {{ editingProject() ? 'Edit Project' : 'New Project' }}
          </h2>
          <db-project-form
            [project]="editingProject()"
            [isSubmitting]="projectStore.loading()"
            (formSave)="onSave($event)"
            (formCancel)="closeModal()"
          />
        </div>
      </div>
    }

    <!-- Delete confirmation -->
    @if (deletingId()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      >
        <div class="w-full max-w-sm rounded-xl bg-[var(--color-surface)] p-6 shadow-xl">
          <h2 class="text-lg font-semibold text-[var(--color-text)]">
            Delete project?
          </h2>
          <p class="mt-2 text-sm text-[var(--color-text-secondary)]">
            This will permanently delete the project and all its tasks. This
            action cannot be undone.
          </p>
          <div class="mt-4 flex justify-end gap-2">
            <button
              type="button"
              (click)="deletingId.set(null)"
              class="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)]"
            >
              Cancel
            </button>
            <button
              type="button"
              (click)="onDeleteConfirm()"
              [disabled]="projectStore.loading()"
              class="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent implements OnInit {
  protected projectStore = inject(ProjectStore);

  showModal = signal(false);
  editingProject = signal<Project | null>(null);
  deletingId = signal<string | null>(null);

  ngOnInit(): void {
    this.projectStore.loadProjects();
  }

  openCreate(): void {
    this.editingProject.set(null);
    this.showModal.set(true);
  }

  openEdit(project: Project): void {
    this.editingProject.set(project);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingProject.set(null);
  }

  confirmDelete(id: string): void {
    this.deletingId.set(id);
  }

  async onSave(value: ProjectFormValue): Promise<void> {
    const editing = this.editingProject();
    if (editing) {
      await this.projectStore.updateProject(editing.id, value);
    } else {
      await this.projectStore.createProject(value);
    }
    if (!this.projectStore.error()) {
      this.closeModal();
    }
  }

  async onDeleteConfirm(): Promise<void> {
    const id = this.deletingId();
    if (!id) return;
    await this.projectStore.deleteProject(id);
    if (!this.projectStore.error()) {
      this.deletingId.set(null);
    }
  }
}
