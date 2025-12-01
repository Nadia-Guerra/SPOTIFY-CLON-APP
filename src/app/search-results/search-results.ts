import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService, SpotifyTrack, SpotifyAlbum, SpotifyArtist } from '../services/spotify-api/search-service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.css'],
  standalone: false
})
export class SearchResults implements OnInit {
  artists: SpotifyArtist[] = [];
  albums: SpotifyAlbum[] = [];
  tracks: SpotifyTrack[] = [];
  searchQuery: string = '';
  currentSong: SpotifyTrack | null = null;
  currentPlaylist: SpotifyTrack[] = [];
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      if (this.searchQuery) {
        this.performSearch();
      }
    });
  }

  performSearch() {
    this.isLoading = true;
    this.searchService.searchAll(this.searchQuery).subscribe({
      next: (response) => {
        this.artists = response.artists?.items || [];
        this.albums = response.albums?.items || [];
        this.tracks = response.tracks?.items || [];
        this.currentPlaylist = this.tracks;
        
        if (this.tracks.length > 0) {
          this.currentSong = this.tracks[0];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error en búsqueda:', err);
        this.artists = [];
        this.albums = [];
        this.tracks = [];
        this.isLoading = false;
      }
    });
  }

  selectSong(track: SpotifyTrack) {
    this.currentSong = track;
  }

  selectAlbum(album: SpotifyAlbum) {
    this.searchService.getAlbumTracks(album.id).subscribe({
      next: (data) => {
        this.currentPlaylist = data.items;
        if (data.items.length > 0) {
          this.currentSong = data.items[0];
        }
      },
      error: (err) => {
        console.error('Error al cargar álbum:', err);
      }
    });
  }

  onSongChanged(track: SpotifyTrack) {
    this.currentSong = track;
  }

  hasResults(): boolean {
    return this.artists.length > 0 || this.albums.length > 0 || this.tracks.length > 0;
  }
}
