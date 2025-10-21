import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { registerInjectable } from '@angular/core/primitives/di';
import{ tap } from 'rxjs'
import { CookieStorageService } from '../services/cookie-storage-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const _cookieService:CookieStorageService = inject(CookieStorageService)

//modificar request

return next(req).pipe(
  tap(
    event =>{
      if(!req.url.includes('/api/token'))
        return next(req);

      if(event.type !== HttpEventType.Response) 
        return next(req);
                                //se define as any estamos indicando un casteo y ahora puedo yo hacer cosas con el
      const body = event.body as any;

    if(!body || !body.access_token)
      return next(req);

    const expireTimeMS = 60*60*1000;
    const expireDate = new Date(Date.now()+expireTimeMS);

    _cookieService.setCookie('acces_token', body.access_token, expireDate);
    }
  )
)
};
