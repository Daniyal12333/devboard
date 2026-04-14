import {
  ApplicationConfig,
  ErrorHandler,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { SUPABASE_CONFIG } from '@devboard/data-access-auth';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { authInterceptor } from './core/auth/interceptors/auth.interceptor';
import { GlobalErrorHandler } from './core/services/global-error-handler.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(appRoutes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: SUPABASE_CONFIG,
      useValue: {
        supabaseUrl: environment.supabaseUrl,
        supabaseAnonKey: environment.supabaseAnonKey,
      },
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
