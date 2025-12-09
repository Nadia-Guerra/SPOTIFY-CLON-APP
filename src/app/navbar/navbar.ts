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
  const value = this.searchValue.trim();

  if (value) {
    this.router.navigate(['/search'], { 
      queryParams: { q: value },
      queryParamsHandling: 'merge'
    });
  } else {
    this.router.navigate(['/']);
  }
}


}