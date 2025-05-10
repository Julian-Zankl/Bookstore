import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Book } from "../models/book.model";
import { environment } from "../../environment/environment";

@Injectable({ providedIn: 'root' })
export class BookService {
  private http = inject(HttpClient);

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${environment.api}/books`);
  }

  getBook(id: string): Observable<Book> {
    return this.http.get<Book>(`${environment.api}/books/${id}`);
  }
}
