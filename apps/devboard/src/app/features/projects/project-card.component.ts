import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import type { Project } from '@devboard/shared-models';

@Component({
  selector: 'db-project-card',
  standalone: true,
  template: `
    <article
      class="group flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0 flex-1">
          <h3
            class="truncate text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]"
          >
            {{ project().name }}
          </h3>
          @if (project().description) {
            <p class="mt-1 line-clamp-2 text-sm text-[var(--color-text-secondary)]">
              {{ project().description }}
            </p>
          }
        </div>

        <span
          class="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
          [class]="statusClass()"
        >
          {{ project().status }}
        </span>
      </div>

      <div class="flex items-center justify-between">
        <time
          class="text-xs text-[var(--color-text-secondary)]"
          [attr.datetime]="project().updated_at"
        >
          Updated {{ formatDate(project().updated_at) }}
        </time>

        <div class="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            (click)="edit.emit(project())"
            class="rounded-md p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text)]"
            aria-label="Edit project"
          >
            ✏️
          </button>
          <button
            type="button"
            (click)="deleteProject.emit(project().id)"
            class="rounded-md p-1.5 text-[var(--color-text-secondary)] hover:bg-red-50 hover:text-red-500"
            aria-label="Delete project"
          >
            🗑️
          </button>
        </div>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent {
  project = input.required<Project>();
  edit = output<Project>();
  deleteProject = output<string>();

  statusClass = computed(() => {
    const status = this.project().status;
    return {
      active: 'bg-green-100 text-green-700',
      completed: 'bg-blue-100 text-blue-700',
      archived: 'bg-gray-100 text-gray-500',
    }[status];
  });

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }
}
