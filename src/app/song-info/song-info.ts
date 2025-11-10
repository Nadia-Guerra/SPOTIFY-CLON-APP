import { Component, Input } from '@angular/core';
import { SpotifyTrack } from '../services/spotify-api/search-service';

@Component({
  selector: 'app-song-info',
  templateUrl: './song-info.html',
  styleUrls: ['./song-info.css'], 
  standalone: false
})
export class SongInfo {
  @Input() song!: SpotifyTrack;
}
