import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceBase } from '@devboard/data-access-auth';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthServiceBase);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/auth/login']);
};
