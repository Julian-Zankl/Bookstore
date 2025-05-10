import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { Book } from '../models/book.model';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { BookService } from './book.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private platformId = inject(PLATFORM_ID);
  private bookService = inject(BookService);
  private cartKey = 'bookstore_cart';
  private cartItems: CartItem[] = [];
  private isBrowser!: boolean;

  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId)

    if (this.isBrowser) {
      const storedCart = localStorage.getItem(this.cartKey);
      if (storedCart) {
        this.cartItems = JSON.parse(storedCart);
        this.cartCount.next(this.getTotalItems());
      }
    }
  }

  getItems(): CartItem[] {
    return [...this.cartItems];
  }

  addToCart(book: Book) {
    const index = this.cartItems.findIndex((item) => item.bookId === book.id);

    if (index !== -1) {
      this.cartItems[index].quantity += 1;
    } else {
      this.cartItems.push({ bookId: book.id, quantity: 1 });
    }

    this.saveCart();
  }

  removeFromCart(bookId: string) {
    this.cartItems = this.cartItems.filter((item) => item.bookId !== bookId);
    this.saveCart();
  }

  updateQuantity(bookId: string, quantity: number) {
    const item = this.cartItems.find((i) => i.bookId === bookId);

    if (item && quantity > 0) {
      item.quantity = quantity;
    } else {
      this.removeFromCart(bookId);
    }

    this.saveCart();
  }

  clearCart() {
    this.cartItems = [];
    if (this.isBrowser) {
      localStorage.removeItem(this.cartKey);
      this.cartCount.next(0);
    }
  }

  async getTotal(): Promise<number> {
    const bookRequests = this.cartItems.map((item) =>
      firstValueFrom(this.bookService.getBook(item.bookId))
    );
    const books: Book[] = await Promise.all(bookRequests);

    let total = 0;
    books.forEach((book, index) => {
      if (book) {
        total += book.price * this.cartItems[index].quantity;
      }
    });

    return total;
  }

  private getTotalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  private saveCart() {
    if (this.isBrowser) {
      localStorage.setItem(this.cartKey, JSON.stringify(this.cartItems));
      this.cartCount.next(this.getTotalItems());
    }
  }
}
