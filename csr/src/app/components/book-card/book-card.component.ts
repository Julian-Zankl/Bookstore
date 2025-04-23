import { Component, inject, Input } from '@angular/core';
import { Book } from '../../models/book.model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { ToastComponent } from '../toast/toast.component';

@Component({
  standalone: true,
  selector: 'app-book-card',
  imports: [ToastComponent],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss'
})
export class BookCardComponent {
  @Input({required: true}) book!: Book;

  private cartService = inject(CartService);
  private router = inject(Router);

  protected toastMessage = '';
  protected showToast = false;

  protected addToCart(event: Event) {
    event.stopPropagation();
    this.cartService.addToCart(this.book);
    this.toastMessage = `${this.book.title} added to cart`;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  protected goToBookDetail() {
    this.router.navigate([`/books/${this.book.id}`]);
  }
}
