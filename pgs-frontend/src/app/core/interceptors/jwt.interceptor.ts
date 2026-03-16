import { Injectable } from '@angular/core';
import {
  HttpRequest, HttpHandler, HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('pgs_token');

    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Clear session and redirect - but only if not already on login page
          localStorage.removeItem('pgs_token');
          localStorage.removeItem('pgs_user');
          if (!this.router.url.includes('/auth/')) {
            this.router.navigateByUrl('/auth/login', { replaceUrl: true });
          }
        }
        // Don't throw for non-critical errors on dashboard - just return empty
        return throwError(() => error);
      })
    );
  }
}
