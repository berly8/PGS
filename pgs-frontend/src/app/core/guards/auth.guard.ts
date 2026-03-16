import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/auth/login']);
  }

  const requiredRoles = route.data['roles'] as Role[] | undefined;
  if (requiredRoles && !auth.hasRole(...requiredRoles)) {
    return router.createUrlTree(['/auth/login']);
  }

  return true;
};
