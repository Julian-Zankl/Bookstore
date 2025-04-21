import { Component, inject, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { BookCardComponent } from "../book-card/book-card.component";
import { Book } from '../../models/book.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-book-list',
  imports: [BookCardComponent, CommonModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent implements OnInit {
  private bookService = inject(BookService);

  protected books: Book[] = [];

  ngOnInit() {
    this.bookService.getBooks().subscribe((data) => {
      this.books = data;
    });
  }
}
