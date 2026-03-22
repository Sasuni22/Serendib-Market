import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();

  let apiReq = req;
  if (req.url.startsWith('/api')) {
    apiReq = req.clone({
      url: `${environment.apiUrl}${req.url}`
    });
  }

  if (token) {
    apiReq = apiReq.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(apiReq);
};