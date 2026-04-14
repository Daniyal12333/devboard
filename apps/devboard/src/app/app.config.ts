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
import {
  AuthService,
  AuthServiceBase,
  MockAuthService,
  SUPABASE_CONFIG,
} from '@devboard/data-access-auth';
import {
  MockProjectService,
  ProjectService,
  ProjectServiceBase,
} from '@devboard/data-access-projects';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { authInterceptor } from './core/auth/interceptors/auth.interceptor';
import { GlobalErrorHandler } from './core/services/global-error-handler.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(appRoutes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(
      ...(environment.useMocks ? [] : [withInterceptors([authInterceptor])]),
    ),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },

    // Supabase config (used only when not mocking)
    {
      provide: SUPABASE_CONFIG,
      useValue: {
        supabaseUrl: environment.supabaseUrl,
        supabaseAnonKey: environment.supabaseAnonKey,
      },
    },

    // Auth service — swap real ↔ mock via environment flag
    {
      provide: AuthServiceBase,
      useClass: environment.useMocks ? MockAuthService : AuthService,
    },

    // Project service — swap real ↔ mock via environment flag
    {
      provide: ProjectServiceBase,
      useClass: environment.useMocks ? MockProjectService : ProjectService,
    },
  ],
};
