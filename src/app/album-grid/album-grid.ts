import { Component, Input } from '@angular/core';
import { SpotifyTrack } from '../services/spotify-api/search-service';

@Component({
  selector: 'app-album-grid',
  templateUrl: './album-grid.html',
  styleUrls: ['./album-grid.css'],
  standalone: false

})
export class AlbumGrid {
  @Input() albums: SpotifyTrack[] = [];
}
