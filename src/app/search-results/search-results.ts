import { Component, Input } from '@angular/core';
import { SpotifyTrack } from '../services/spotify-api/search-service'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.css'],
  standalone: false
})
export class SearchResults {
  @Input() results: SpotifyTrack[] = [];
}
