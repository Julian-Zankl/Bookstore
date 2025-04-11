import { Body, Controller, Get, Post } from "@nestjs/common";
import { BooksService } from "./books.service";
import { Book } from "../entities/book.entity";

@Controller("books")
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getBooks(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Post()
  addBook(
    @Body() book: {
      title: string;
      price: number;
      stock: number;
      authorId: number;
    },
  ): Promise<Book> {
    return this.booksService.create(book);
  }
}
