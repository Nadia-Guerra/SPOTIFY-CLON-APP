import { HttpInterceptorFn } from '@angular/common/http';
import { CookieStorageService } from '../services/cookie-storage-service';
import { inject } from '@angular/core';

export const addAuthHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  
  if(!req.url.includes('api.spotify.com/v1'))
    return next(req);

  const _cookieService: CookieStorageService = inject(CookieStorageService);

  const token = _cookieService.getCookie('access_token');

  const newReq = req.clone({
    setHeaders:{
      'Authorization': `Bearer ${token}`
    }
  })
  
  return next(newReq);
};
