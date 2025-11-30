import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';

import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { CookieStorageService } from '../services/cookie-storage-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const _cookieService: CookieStorageService = inject(CookieStorageService)

  return next(req).pipe(
    tap(
      event => {
        
        if(!req.url.includes('/api/token'))
          return event;
        
        if(event.type !== HttpEventType.Response)
          return event;

        const body = event.body as any;

        if(!body || !body.access_token)
          return event;

        const expireTimeMS = 60*60*1000; //calcula el tiempo en que expira el token
        const expireDate = new Date(Date.now()+expireTimeMS);

        _cookieService.setCookie('access_token', body.access_token, expireDate);

        return event;
      }
    )
  );
};
