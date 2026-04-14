import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'db-header',
  standalone: true,
  template: `
    <header
      class="flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6"
    >
      <button
        type="button"
        (click)="toggleSidebar.emit()"
        class="rounded-md p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text)]"
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      <div class="flex items-center gap-3">
        <!-- Theme toggle -->
        <button
          type="button"
          (click)="themeService.toggleTheme()"
          class="rounded-md p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)]"
          [attr.aria-label]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          {{ themeService.isDark() ? '☀️' : '🌙' }}
        </button>

        <!-- User avatar placeholder -->
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-medium text-white"
          aria-label="User menu"
        >
          U
        </button>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  toggleSidebar = output<void>();
  protected themeService = inject(ThemeService);
}
