import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService, SpotifyTrack } from '../services/spotify-api/search-service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.css'],
  standalone: false
})
export class SearchResults implements OnInit {
  results: SpotifyTrack[] = [];
  searchQuery: string = '';
  currentSong: SpotifyTrack | null = null;
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
    this.searchService.searchTracks(this.searchQuery, 20).subscribe({
      next: (response) => {
        this.results = response.tracks.items;
        if (this.results.length > 0) {
          this.currentSong = this.results[0];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error en búsqueda:', err);
        this.results = [];
        this.isLoading = false;
      }
    });
  }

  selectSong(track: SpotifyTrack) {
    this.currentSong = track;
  }

  onSongChanged(track: SpotifyTrack) {
    this.currentSong = track;
  }
}