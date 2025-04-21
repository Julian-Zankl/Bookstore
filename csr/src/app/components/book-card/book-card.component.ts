import { Component, inject, Input } from '@angular/core';
import { Book } from '../../models/book.model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-book-card',
  imports: [],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss'
})
export class BookCardComponent {
  @Input({required: true}) book!: Book;

  private cartService = inject(CartService);
  private router = inject(Router);

  protected addToCart() {
    this.cartService.addToCart(this.book);
  }

  protected goToBookDetail() {
    this.router.navigate([`/books/${this.book.id}`]);
  }
}
