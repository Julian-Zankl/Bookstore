import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit {
  private cartService = inject(CartService);

  protected cartCount = 0;

  ngOnInit() {
    this.cartService.cartCount$.subscribe((count) => (this.cartCount = count));
  }
}
