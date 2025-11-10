import { Component } from '@angular/core';
import { SpotifyTrack } from '../services/spotify-api/search-service';

@Component({
  selector: 'app-player',
  templateUrl: './player.html',
  styleUrls: ['./player.css'],
  standalone: false

})
export class Player {
  searchResults: SpotifyTrack[] = [];
  playlist: SpotifyTrack[] = [];
  currentSong: SpotifyTrack | null = null;

  song(): SpotifyTrack | null {
    return this.currentSong;
  }

  onSearchResults(results: SpotifyTrack[]) {
    this.searchResults = results;
    this.playlist = results;
    this.currentSong = results.length ? results[0] : null;
  }

  showSearchResults(): boolean {
    return this.searchResults && this.searchResults.length > 0;
  }
}
