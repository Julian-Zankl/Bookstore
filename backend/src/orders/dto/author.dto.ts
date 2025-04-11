import { BookDto } from "./book.dto";

export class AuthorDto {
    id: number;
    name: string;
    books: BookDto[];
}
