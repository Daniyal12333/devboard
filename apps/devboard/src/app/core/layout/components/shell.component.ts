import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { HeaderComponent } from './header.component';
import { ToastContainerComponent } from './toast-container.component';

@Component({
  selector: 'db-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, ToastContainerComponent],
  template: `
    <div class="flex h-screen overflow-hidden bg-[var(--color-surface)]">
      <db-sidebar
        [collapsed]="sidebarCollapsed()"
        (toggleCollapse)="toggleSidebar()"
      />
      <div
        class="flex flex-1 flex-col overflow-hidden transition-all duration-300"
        [style.margin-left]="contentMargin()"
      >
        <db-header (toggleSidebar)="toggleSidebar()" />
        <main class="flex-1 overflow-y-auto p-6">
          <router-outlet />
        </main>
      </div>
    </div>
    <db-toast-container />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  sidebarCollapsed = signal(false);

  contentMargin = computed(() =>
    this.sidebarCollapsed()
      ? 'var(--sidebar-collapsed-width)'
      : 'var(--sidebar-width)',
  );

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }
}
