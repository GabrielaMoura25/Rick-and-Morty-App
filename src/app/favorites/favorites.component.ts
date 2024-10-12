import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent implements OnInit {
  favoriteCharacters: any[] = [];

  @Input() favoriteCount: number = 0;

  constructor(private _router: Router) {}

  ngOnInit(): void {
    this.loadFavorites();
  }
  loadFavorites() {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      this.favoriteCharacters = JSON.parse(storedFavorites);
    }

    this.favoriteCount = this.favoriteCharacters.length;
  }

  removeFavorite(characterId: number) {
    this.favoriteCharacters = this.favoriteCharacters.filter(
      (c) => c.id !== characterId
    );
    localStorage.setItem('favorites', JSON.stringify(this.favoriteCharacters));

    this.favoriteCount = this.favoriteCharacters.length;
  }

  goHome(): void {
    this._router.navigate(['/']);
  }
}
