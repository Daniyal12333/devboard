import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'db-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside
      class="fixed inset-y-0 left-0 z-30 flex flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300"
      [class.w-64]="!collapsed()"
      [class.w-16]="collapsed()"
    >
      <!-- Logo -->
      <div
        class="flex h-16 items-center border-b border-[var(--color-border)] px-4"
      >
        @if (!collapsed()) {
          <span class="text-xl font-bold text-[var(--color-primary)]">
            DevBoard
          </span>
        } @else {
          <span class="text-xl font-bold text-[var(--color-primary)]">DB</span>
        }
      </div>

      <!-- Nav items -->
      <nav class="flex-1 space-y-1 overflow-y-auto p-2">
        @for (item of navItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-[var(--color-primary)] text-white"
            [routerLinkActiveOptions]="{ exact: item.route === '/' }"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-secondary)]"
            [title]="collapsed() ? item.label : ''"
          >
            <span class="text-lg" aria-hidden="true">{{ item.icon }}</span>
            @if (!collapsed()) {
              <span>{{ item.label }}</span>
            }
          </a>
        }
      </nav>

      <!-- Collapse toggle -->
      <button
        type="button"
        (click)="toggleCollapse.emit()"
        class="flex items-center justify-center border-t border-[var(--color-border)] p-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
        [attr.aria-label]="collapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
      >
        {{ collapsed() ? '→' : '←' }}
      </button>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  collapsed = input(false);
  toggleCollapse = output<void>();

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: '📊', route: '/dashboard' },
    { label: 'Projects', icon: '📁', route: '/projects' },
    { label: 'Team', icon: '👥', route: '/team' },
    { label: 'Settings', icon: '⚙️', route: '/settings' },
  ];
}
