import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService, SpotifyTrack } from '../services/spotify-api/search-service';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.html',
  styleUrls: ['./album-detail.css'],
  standalone: false
})
export class AlbumDetail implements OnInit {
  albumId: string = '';
  tracks: SpotifyTrack[] = [];
  currentSong: SpotifyTrack | null = null;

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.albumId = params['id'];
      this.loadAlbumTracks();
    });
  }

  loadAlbumTracks() {
    this.searchService.getAlbumTracks(this.albumId).subscribe({
      next: (response) => {
        this.tracks = response.items;
        if (this.tracks.length > 0) {
          this.currentSong = this.tracks[0];
        }
      },
      error: (err) => {
        console.error('Error al cargar canciones del álbum:', err);
      }
    });
  }

  onSongSelected(track: SpotifyTrack) {
    this.currentSong = track;
  }
}