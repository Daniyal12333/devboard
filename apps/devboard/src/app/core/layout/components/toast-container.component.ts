import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'db-toast-container',
  standalone: true,
  template: `
    <div
      class="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      aria-live="polite"
      aria-atomic="false"
    >
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-start gap-3 rounded-lg px-4 py-3 shadow-lg"
          [class]="toastClass(toast)"
          role="alert"
        >
          <span class="text-lg leading-none" aria-hidden="true">{{ toastIcon(toast) }}</span>
          <p class="flex-1 text-sm font-medium">{{ toast.message }}</p>
          <button
            type="button"
            (click)="toastService.dismiss(toast.id)"
            class="ml-2 shrink-0 opacity-60 hover:opacity-100"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainerComponent {
  protected toastService = inject(ToastService);

  toastClass(toast: Toast): string {
    const base = 'min-w-64 max-w-sm ';
    const map: Record<string, string> = {
      success: base + 'bg-green-50 text-green-800 border border-green-200',
      error: base + 'bg-red-50 text-red-800 border border-red-200',
      warning: base + 'bg-amber-50 text-amber-800 border border-amber-200',
      info: base + 'bg-blue-50 text-blue-800 border border-blue-200',
    };
    return map[toast.type] ?? map['info'];
  }

  toastIcon(toast: Toast): string {
    const map: Record<string, string> = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
    };
    return map[toast.type] ?? '🔔';
  }
}
