import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@devboard/data-access-auth';

/** Redirects authenticated users away from auth pages */
export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/dashboard']);
};
