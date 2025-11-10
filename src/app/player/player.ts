import { Component, signal } from '@angular/core';
import { SpotifyTrack } from '../services/spotify-api/search-service';

@Component({
  selector: 'app-player',
  templateUrl: './player.html',
  styleUrls: ['./player.css'],
  standalone: false
})
export class Player {
  searchResults = signal<SpotifyTrack[]>([]);
  playlist: SpotifyTrack[] = [];
  song = signal<SpotifyTrack | null>(null);

  onSearchResults(results: SpotifyTrack[]) {
    this.searchResults.set(results);
    this.playlist = results;
    if (results.length > 0) {
      this.song.set(results[0]);
    }
  }

  showSearchResults() {
    return this.searchResults().length > 0;
  }
}