import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { SongInfo } from './song-info/song-info';
import { AudioController } from './audio-controller/audio-controller';
import { Playlist } from './playlist/playlist';
import { Player } from './player/player';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor';
import { addAuthHeaderInterceptor } from './interceptors/add-auth-header-interceptor';
import { Navbar } from './navbar/navbar';
import { AlbumGrid } from './album-grid/album-grid';
import { SearchResults } from './search-results/search-results';

@NgModule({
  declarations: [
    App,
    SongInfo,
    AudioController,
    Playlist,
    Player,
    Navbar,
    AlbumGrid,
    SearchResults
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        addAuthHeaderInterceptor
      ])
    ),
  ],
  bootstrap: [App]
})
export class AppModule { }
