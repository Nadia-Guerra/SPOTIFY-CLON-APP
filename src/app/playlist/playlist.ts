import { Component, Input } from '@angular/core';
import { SpotifyTrack } from '../services/spotify-api/search-service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.html',
  styleUrls: ['./playlist.css'],
  standalone: false
})
export class Playlist {
  @Input() playlist: SpotifyTrack[] = [];
}
