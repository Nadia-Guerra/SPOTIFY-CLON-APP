import { Component, Input } from '@angular/core';
import { SpotifyTrack } from '../services/spotify-api/search-service';

@Component({
  selector: 'app-song-info',
  templateUrl: './song-info.html',
  styleUrls: ['./song-info.css'], 
  standalone: false,
  host: {
    '[class]': 'displayMode'  
  }
})
export class SongInfo {
  @Input() song!: SpotifyTrack;
  @Input() displayMode: string = 'card';  
}