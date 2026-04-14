import { ErrorHandler, inject, Injectable, NgZone } from '@angular/core';
import { ToastService } from './toast.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private toastService = inject(ToastService);
  private zone = inject(NgZone);

  handleError(error: unknown): void {
    const message = this.extractMessage(error);
    console.error('[GlobalErrorHandler]', error);

    this.zone.run(() => {
      this.toastService.error(message);
    });
  }

  private extractMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'An unexpected error occurred.';
  }
}
