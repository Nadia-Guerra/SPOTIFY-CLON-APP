import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  searchValue = '';

  constructor(private router: Router) {}

  onSearch() {
    if (this.searchValue.trim()) {
      this.router.navigate(['/search'], { 
        queryParams: { q: this.searchValue } 
      });
    } else {
      this.router.navigate(['/']);
    }
  }
}