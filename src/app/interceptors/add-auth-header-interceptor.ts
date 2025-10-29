import { HttpInterceptorFn, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError, switchMap, from } from 'rxjs';
import { CookieStorageService } from '../services/cookie-storage-service';
import { SpotifyAuthService } from '../services/spotify-auth-service';

export const addAuthHeaderInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<unknown>> => {
  
  if (!req.url.includes('api.spotify.com/v1')) {
    return next(req);
  }

  const cookieService: CookieStorageService = inject(CookieStorageService);
  const authService: SpotifyAuthService = inject(SpotifyAuthService);

  const token = cookieService.getCookie('access_token');

  const newReq = req.clone({
    setHeaders: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return next(newReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el error es 401 (token expirado), renovar
      if (error.status === 401) {
        console.warn('⚠️ Token expirado, renovando...');
        
        // Convertir la Promise en Observable con from()
        return from(authService.refreshToken()).pipe(
          switchMap(() => {
            // Reintentar la petición con el nuevo token
            const newToken = cookieService.getCookie('access_token');
            const retryReq = req.clone({
              setHeaders: {
                'Authorization': `Bearer ${newToken}`
              }
            });
            
            return next(retryReq);
          }),
          catchError((retryError) => throwError(() => retryError))
        );
      }
      
      return throwError(() => error);
    })
  );
};