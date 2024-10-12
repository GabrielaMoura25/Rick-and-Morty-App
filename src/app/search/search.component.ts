import { Component, OnInit, HostListener } from '@angular/core';
import { RickAndMortyService } from '../rick-and-morty.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  characters: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  favoriteCount: number = 0;

  private _searchSubject = new Subject<string>();
  private currentPage: number = 1;
  private totalPages: number = 0;

  constructor(private _rickAndMortyService: RickAndMortyService) {}

  ngOnInit() {
    this.loadCharacters();

    this._searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((searchTerm) => {
        this.onSearch(searchTerm);
      });

    this.updateFavoriteCount();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    const windowScroll = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.offsetHeight;

    const loadMoreThreshold = 50;

    if (windowScroll >= documentHeight - loadMoreThreshold && !this.isLoading && this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadCharacters();
    }
  }

  onSearchInputChange() {
    this._searchSubject.next(this.searchTerm);
  }

  onSearch(searchTerm?: string) {
    if (searchTerm) {
      this.isLoading = true;
      this.currentPage = 1;
      this.characters = [];
      this.loadCharacters(searchTerm);
    } else {
      this.loadCharacters();
    }
  }

  loadCharacters(searchTerm?: string) {
    this.isLoading = true;

    if (searchTerm) {
      this._rickAndMortyService.getCharacterByName(searchTerm).subscribe({
        next: (response) => {
          this.characters = response.results;
          this.totalPages = response.info.pages;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.characters = [];
        },
      });
    } else {
      this._rickAndMortyService.getAllCharacters(this.currentPage).subscribe({
        next: (response) => {
          this.characters = this.characters.concat(response.results);
          this.totalPages = response.info.pages;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          console.error('Error fetching characters');
        },
      });
    }
  }

  toggleFavorite(character: any) {
    const storedFavorites = localStorage.getItem('favorites');
    let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

    if (this.isFavorite(character)) {
      favorites = favorites.filter((fav: any) => fav.id !== character.id);
    } else {
      favorites.push(character);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    this.updateFavoriteCount();
  }

  isFavorite(character: any): boolean {
    const storedFavorites = localStorage.getItem('favorites');
    const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    return favorites.some((fav: any) => fav.id === character.id);
  }

  updateFavoriteCount() {
    const storedFavorites = localStorage.getItem('favorites');
    const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    this.favoriteCount = favorites.length;
  }
}
