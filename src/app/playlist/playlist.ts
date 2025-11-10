import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SpotifyTrack } from '../services/spotify-api/search-service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.html',
  styleUrls: ['./playlist.css'],
  standalone: false
})
export class Playlist {
  @Input() playlist: SpotifyTrack[] = [];
  @Output() songSelected = new EventEmitter<SpotifyTrack>();

  selectSong(track: SpotifyTrack) {
    this.songSelected.emit(track);
  }
}
