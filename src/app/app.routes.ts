import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { FavoritesComponent } from './favorites/favorites.component';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'favorites', component: FavoritesComponent },
];
