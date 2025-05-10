import { Component, inject, Input, OnInit } from '@angular/core';
import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-book-detail',
  imports: [CommonModule],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss'
})
export class BookDetailComponent implements OnInit {
  @Input({required: true}) id!: string;

  private bookService = inject(BookService);
  private cartService = inject(CartService)

  protected book!: Book;
  protected loading = true;

  ngOnInit() {
    if (this.id) {
      this.bookService.getBook(this.id).subscribe((book) => {
        this.book = book;
        this.loading = false;
      });
    }
  }

  protected addToCart() {
    this.cartService.addToCart(this.book);
  }
}
