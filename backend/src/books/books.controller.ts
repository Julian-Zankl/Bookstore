import { Controller, Get, Post, Body } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from '../entities/book.entity';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getBooks(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Post()
  addBook(@Body() book: Partial<Book>): Promise<Book> {
    return this.booksService.create(book);
  }
}
