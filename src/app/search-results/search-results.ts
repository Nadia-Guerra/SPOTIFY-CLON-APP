import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SpotifyTrack } from '../services/spotify-api/search-service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.css'],
  standalone: false
})
export class SearchResults {
  @Input() results: SpotifyTrack[] = [];
  @Output() songSelected = new EventEmitter<SpotifyTrack>();

  selectSong(track: SpotifyTrack) {
    this.songSelected.emit(track);
  }
}
