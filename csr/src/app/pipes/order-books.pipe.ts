import { inject, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { BookService } from '../services/book.service';
import { OrderItem } from '../models/order-item.model';
import { Book } from '../models/book.model';

@Pipe({
  standalone: true,
  name: 'orderBooks',
  pure: true
})
export class OrderBooksPipe implements PipeTransform {
  private bookService = inject(BookService);

  transform(orderItems: OrderItem[]): Observable<OrderItemWithBook[]> {
    return new Observable<OrderItemWithBook[]>((observer) => {
      const result: OrderItemWithBook[] = [];

      orderItems.forEach(item => {
        this.bookService.getBook(item.bookId).subscribe(book => {
          result.push({ ...item, book });

          if (result.length === orderItems.length) {
            observer.next(result);
            observer.complete();
          }
        });
      });
    });
  }
}

export interface OrderItemWithBook extends OrderItem {
  book: Book;
}
