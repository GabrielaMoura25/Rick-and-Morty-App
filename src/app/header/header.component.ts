import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() favoriteCount: number = 0;

  constructor(private _router: Router) {}
  goFavorites(): void {
    this._router.navigate(['/favorites']);
  }

  goHome(): void {
    this._router.navigate(['/']);
  }
}
