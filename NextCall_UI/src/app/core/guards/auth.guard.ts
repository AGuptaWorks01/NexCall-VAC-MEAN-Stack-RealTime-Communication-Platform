import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getAuthToken();
  const isLoggedIn = token !== null && !authService.isTokenExpired(token);

  const publicRoutes = ['/login', '/register'];

  if (!isLoggedIn && !publicRoutes.includes(state.url)) {
    // Trying to access a protected page without being logged in
    router.navigate(['/login']);
    return false;
  }

  if (isLoggedIn && publicRoutes.includes(state.url)) {
    // Already logged in but trying to access login/register page
    router.navigate(['/home']);
    return false;
  }

  return true;
};
