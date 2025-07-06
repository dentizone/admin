import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const router = inject(Router);
  const loading = inject(LoadingService);
  const accessToken = localStorage.getItem('accessToken');
  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  let isRefreshing = false;
  const refreshTokenSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);

  function handle401Error(
    request: HttpRequest<any>
  ): Observable<HttpEvent<any>> {
    if (!isRefreshing) {
      isRefreshing = true;
      loading.show();
      refreshTokenSubject.next(null);
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        return refreshAccessToken(refreshToken).pipe(
          switchMap((newToken: string) => {
            isRefreshing = false;
            loading.hide();
            localStorage.setItem('accessToken', newToken);
            refreshTokenSubject.next(newToken);
            return next(
              request.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              })
            );
          }),
          catchError((err) => {
            isRefreshing = false;
            loading.hide();
            router.navigate(['/login']);
            return throwError(() => err);
          })
        );
      } else {
        loading.hide();
        router.navigate(['/login']);
      }
    }
    return refreshTokenSubject.pipe(
      filter((token) => token != null),
      take(1),
      switchMap((token) =>
        next(
          request.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          })
        )
      )
    );
  }

  function refreshAccessToken(refreshToken: string): Observable<string> {
    return new Observable<string>((observer) => {
      fetch('https://apit.gitnasr.com/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })
        .then(async (response) => {
          if (!response.ok) throw new Error('Refresh failed');
          const data = await response.json();
          observer.next(data.accessToken);
          observer.complete();
        })
        .catch((err) => observer.error(err));
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(authReq);
      }
      return throwError(() => error);
    })
  );
};
