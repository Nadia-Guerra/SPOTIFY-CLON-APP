import { Component, Output, EventEmitter } from '@angular/core';
import { SearchService } from '../services/spotify-api/search-service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  searchQuery: string = '';

  @Output() searchResults = new EventEmitter<any>(); 

  constructor(private searchService: SearchService) {}

  onSearch() {
    const query = this.searchQuery.trim();
    if (query.length === 0) {
      this.searchResults.emit([]); //si esta vacia se borra, pero no se pq solo funciona con el click
      return;
    }
    //buscar canciones
    this.searchService.searchTracks(query, 12).subscribe({
      next: (response) => {
        this.searchResults.emit(response.tracks.items); 
      },
      error: (err) => {
        console.error('Error en búsqueda:', err);
        this.searchResults.emit([]);
      }
    });
  }
}
