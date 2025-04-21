import { inject, Pipe, PipeTransform } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookService } from '../services/book.service';
import { CartItem } from '../models/cart-item.model';
import { Book } from '../models/book.model';

@Pipe({
  standalone: true,
  name: 'cartBooks',
  pure: true
})
export class CartBooksPipe implements PipeTransform {
  private bookService = inject(BookService);

  transform(cartItems: CartItem[]): Observable<CartItemWithBook[]> {
    if (!cartItems) {
      return of([]);
    };

    const bookRequests: Observable<CartItemWithBook>[] = cartItems.map(item =>
      this.bookService.getBook(item.bookId).pipe(
        map(book => ({ ...item, book }))
      )
    );

    return forkJoin(bookRequests);
  }
}

export interface CartItemWithBook extends CartItem {
  book: Book;
}
