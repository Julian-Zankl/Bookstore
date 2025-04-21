import { Component, Input } from '@angular/core';
import { BookDetailComponent } from "../../components/book-detail/book-detail.component";

@Component({
  standalone: true,
  selector: 'app-book-detail-page',
  template: '<app-book-detail [id]="id"></app-book-detail>',
  imports: [BookDetailComponent],
})
export class BookDetailPage {
  @Input() id?: string;
}
