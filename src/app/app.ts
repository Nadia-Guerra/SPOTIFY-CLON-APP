import { Component, OnInit } from '@angular/core';
import { SpotifyAuthService } from './services/spotify-auth-service';
import { PlaylistService } from './services/spotify-api/playlist-service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {

  constructor(
    private authService: SpotifyAuthService,
    private playlistService: PlaylistService
  ) {}

  async ngOnInit() {
    // autentica spotify
    await this.authService.initialize();
    console.log('Spotify Auth inicializado');
  }

  doPetition() {
    this.playlistService.getPlaylist().subscribe({
      next: (data) => console.log('Playlist:', data),
      error: (error) => console.error('Error:', error)
    });
  }
}