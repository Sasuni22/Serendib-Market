import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (auth.isLoggedIn()) return true;
  inject(Router).navigate(['/auth/login']);
  return false;
};
export const vendorGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (auth.isVendor()) return true;
  inject(Router).navigate(['/']);
  return false;
};
export const customerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (auth.isCustomer()) return true;
  inject(Router).navigate(['/auth/login']);
  return false;
};