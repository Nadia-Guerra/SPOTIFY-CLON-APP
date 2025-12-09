import { Component, OnInit } from '@angular/core';
import { SearchService, SpotifyAlbum } from '../services/spotify-api/search-service';

@Component({
  selector: 'app-album-grid',
  templateUrl: './album-grid.html',
  styleUrls: ['./album-grid.css'],
  standalone: false
})
export class AlbumGrid implements OnInit {
  albums: SpotifyAlbum[] = [];

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    //álbumes de Mitski
    this.searchService.searchAlbums('mitski', 12).subscribe({
      next: (response) => {
        this.albums = response.albums?.items || [];
        console.log(' Álbumes de Mitski cargados:', this.albums.length);
      },
      error: (err) => {
        console.error('Error al cargar álbumes:', err);
        this.albums = [];
      }
    });
  }
}