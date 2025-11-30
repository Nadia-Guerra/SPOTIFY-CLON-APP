import { Injectable } from '@angular/core';
import { LoginService } from './spotify-api/login-service';
import { CookieStorageService } from './cookie-storage-service';
import { interval, switchMap, filter, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyAuthService {
  
  private tokenRefreshInterval = 50 * 60 * 1000; 
  private isRefreshing = false;

  constructor(
    private loginService: LoginService,
    private cookieService: CookieStorageService
  ) {
    this.initAutoRefresh();
  }

  /*token inicial*/
  async initialize(): Promise<void> {
    if (!this.hasValidToken()) {
      await this.refreshToken();
    }
  }

  /* valida el tokenn*/
  hasValidToken(): boolean {
    return this.cookieService.isCookieValid('access_token');
  }

  /*lo refresca*/
  async refreshToken(): Promise<void> {
    if (this.isRefreshing) {
      return;
    }

    this.isRefreshing = true;
    console.log('Refrescando token de Spotify...');

    try {
      await this.loginService.getAccessToken()
        .pipe(take(1))
        .toPromise();
      
      console.log('Token refrescado correctamente');
    } catch (error) {
      console.error(' Error al refrescar token:', error);
    } finally {
      this.isRefreshing = false;
    }
  }



  private initAutoRefresh(): void {
   
    interval(this.tokenRefreshInterval)
      .pipe(
        filter(() => !this.isRefreshing),
        switchMap(() => this.loginService.getAccessToken())
      )
      .subscribe({
        next: () => console.log('Token renovado automáticamente'),
        error: (error) => console.error(' Error en renovación automática:', error)
      });
  }

  getToken(): string {
    return this.cookieService.getCookie('access_token');
  }
}