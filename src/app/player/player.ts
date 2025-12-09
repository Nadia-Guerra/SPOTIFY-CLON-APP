import { Component, signal, OnInit } from '@angular/core';
import { SpotifyTrack, SearchService } from '../services/spotify-api/search-service';

@Component({
  selector: 'app-player',
  templateUrl: './player.html',
  styleUrls: ['./player.css'],
  standalone: false
})
export class Player implements OnInit {
  searchResults = signal<SpotifyTrack[]>([]);
  playlist: SpotifyTrack[] = [];
  song = signal<SpotifyTrack | null>(null);

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    // id del album de Laufey
    this.loadAlbum('0Ydm84ftyiWRGOIFkdl30L');
  }

  loadAlbum(albumId: string) {
    console.log('Cargando álbum de Laufey...');
    this.searchService.getAlbumTracks(albumId).subscribe({
      next: (response) => {
        this.playlist = response.items;
        console.log('Álbum cargado:', this.playlist.length, 'canciones');
        console.log('Imagen del álbum:', response.albumInfo.images[0]?.url);
        
        if (this.playlist.length > 0) {
          this.song.set(this.playlist[0]);
          console.log('Primera canción:', this.playlist[0].name);
        }
      },
      error: (err) => {
        console.error('Error al cargar álbum:', err);
      }
    });
  }

  onSearchResults(results: SpotifyTrack[]) {
    this.searchResults.set(results);
    this.playlist = results;
    if (results.length > 0) {
      this.song.set(results[0]);
    }
  }

  onAlbumTracks(tracks: SpotifyTrack[]) {
    this.playlist = tracks;
    if (tracks.length > 0) {
      this.song.set(tracks[0]);
    }
  }

  onSongSelected(track: SpotifyTrack) {
    console.log('Canción seleccionada:', track.name);
    this.song.set(track);
  }

  showSearchResults() {
    return this.searchResults().length > 0;
  }
}