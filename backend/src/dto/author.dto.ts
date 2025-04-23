import { BookDto } from './book.dto';

export class AuthorDto {
  id: string;
  name: string;
  books: BookDto[];
}
