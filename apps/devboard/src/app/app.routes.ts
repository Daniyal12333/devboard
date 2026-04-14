import { Route } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { publicGuard } from './core/auth/guards/public.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/layout/components/shell.component').then(
        (m) => m.ShellComponent,
      ),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/projects.component').then(
            (m) => m.ProjectsComponent,
          ),
      },
    ],
  },
  {
    path: 'auth',
    canActivate: [publicGuard],
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
