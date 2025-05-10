import { Component } from '@angular/core';
import { BookListComponent } from "../../components/book-list/book-list.component";

@Component({
  standalone: true,
  selector: 'app-books',
  imports: [BookListComponent],
  template: '<app-book-list></app-book-list>'
})
export class BooksPage {}
