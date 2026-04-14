import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { AuthServiceBase } from '@devboard/data-access-auth';
import { ProjectStore } from '@devboard/data-access-projects';
import { MOCK_DASHBOARD_STATS } from '@devboard/shared-models';
import { environment } from '../../../environments/environment';

interface StatCard {
  label: string;
  value: number;
  icon: string;
  change: string;
}

@Component({
  selector: 'db-dashboard',
  standalone: true,
  template: `
    <div class="space-y-6">
      <!-- Page header -->
      <div>
        <h1 class="text-2xl font-bold text-[var(--color-text)]">Dashboard</h1>
        <p class="mt-1 text-sm text-[var(--color-text-secondary)]">
          Welcome back,
          {{ authService.user()?.user_metadata?.['full_name'] ?? 'there' }}
        </p>
      </div>

      <!-- Stats grid -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          @for (i of [1, 2, 3, 4]; track i) {
            <div
              class="animate-pulse rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            >
              <div class="h-4 w-24 rounded bg-[var(--color-surface-secondary)]"></div>
              <div class="mt-3 h-8 w-16 rounded bg-[var(--color-surface-secondary)]"></div>
            </div>
          }
        </div>
      } @else {
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          @for (card of statCards(); track card.label) {
            <div
              class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-[var(--color-text-secondary)]">
                  {{ card.label }}
                </span>
                <span class="text-2xl" aria-hidden="true">{{ card.icon }}</span>
              </div>
              <p class="mt-2 text-3xl font-bold text-[var(--color-text)]">
                {{ card.value }}
              </p>
              <p class="mt-1 text-xs text-[var(--color-text-secondary)]">
                {{ card.change }}
              </p>
            </div>
          }
        </div>
      }

      <!-- Recent activity placeholder -->
      <div
        class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
      >
        <h2 class="mb-4 text-lg font-semibold text-[var(--color-text)]">
          Recent Activity
        </h2>
        <p class="text-sm text-[var(--color-text-secondary)]">
          Activity feed will appear here once you start working on projects.
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  protected authService = inject(AuthServiceBase);
  private projectStore = inject(ProjectStore);

  isLoading = signal(true);

  private activeTasks = signal(0);
  private teamMembers = signal(0);
  private completedTasks = signal(0);

  statCards = computed((): StatCard[] => [
    {
      label: 'Total Projects',
      icon: '📁',
      value: this.projectStore.projectCount(),
      change: 'Across all workspaces',
    },
    {
      label: 'Active Tasks',
      icon: '✅',
      value: this.activeTasks(),
      change: 'In progress right now',
    },
    {
      label: 'Team Members',
      icon: '👥',
      value: this.teamMembers(),
      change: 'Active collaborators',
    },
    {
      label: 'Completed Tasks',
      icon: '🏆',
      value: this.completedTasks(),
      change: 'This month',
    },
  ]);

  async ngOnInit(): Promise<void> {
    await this.projectStore.loadProjects();
    await this.loadOtherStats();
    this.isLoading.set(false);
  }

  private async loadOtherStats(): Promise<void> {
    if (environment.useMocks) {
      this.activeTasks.set(MOCK_DASHBOARD_STATS.activeTasks);
      this.teamMembers.set(MOCK_DASHBOARD_STATS.teamMembers);
      this.completedTasks.set(MOCK_DASHBOARD_STATS.completedTasks);
    }
    // Real Supabase implementation will go here when useMocks = false
  }
}
