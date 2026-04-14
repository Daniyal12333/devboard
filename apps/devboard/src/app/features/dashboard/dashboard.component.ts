import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { AuthService } from '@devboard/data-access-auth';
import { SupabaseService } from '@devboard/data-access-auth';

interface DashboardStats {
  totalProjects: number;
  activeTasks: number;
  teamMembers: number;
  completedTasks: number;
}

interface StatCard {
  label: string;
  value: number;
  icon: string;
  color: string;
  change?: string;
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
          Welcome back, {{ authService.user()?.user_metadata?.['full_name'] ?? 'there' }}
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
              @if (card.change) {
                <p class="mt-1 text-xs text-[var(--color-text-secondary)]">
                  {{ card.change }}
                </p>
              }
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
  protected authService = inject(AuthService);
  private supabase = inject(SupabaseService);

  isLoading = signal(true);
  private stats = signal<DashboardStats>({
    totalProjects: 0,
    activeTasks: 0,
    teamMembers: 0,
    completedTasks: 0,
  });

  statCards = computed((): StatCard[] => {
    const s = this.stats();
    return [
      {
        label: 'Total Projects',
        icon: '📁',
        value: s.totalProjects,
        color: 'indigo',
        change: 'Across all workspaces',
      },
      {
        label: 'Active Tasks',
        icon: '✅',
        value: s.activeTasks,
        color: 'emerald',
        change: 'In progress right now',
      },
      {
        label: 'Team Members',
        icon: '👥',
        value: s.teamMembers,
        color: 'blue',
        change: 'Active collaborators',
      },
      {
        label: 'Completed Tasks',
        icon: '🏆',
        value: s.completedTasks,
        color: 'amber',
        change: 'This month',
      },
    ];
  });

  async ngOnInit(): Promise<void> {
    await this.loadStats();
  }

  private async loadStats(): Promise<void> {
    try {
      const [projects, profiles] = await Promise.all([
        this.supabase.client.from('projects').select('id', { count: 'exact', head: true }),
        this.supabase.client.from('profiles').select('id', { count: 'exact', head: true }),
      ]);

      const [activeTasks, completedTasks] = await Promise.all([
        this.supabase.client
          .from('tasks')
          .select('id', { count: 'exact', head: true })
          .neq('column_id', null),
        this.supabase.client
          .from('activity_log')
          .select('id', { count: 'exact', head: true })
          .eq('action', 'task_completed')
          .gte('created_at', new Date(new Date().setDate(1)).toISOString()),
      ]);

      this.stats.set({
        totalProjects: projects.count ?? 0,
        activeTasks: activeTasks.count ?? 0,
        teamMembers: profiles.count ?? 0,
        completedTasks: completedTasks.count ?? 0,
      });
    } finally {
      this.isLoading.set(false);
    }
  }
}
