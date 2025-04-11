import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Book } from "../entities/book.entity";
import { Author } from "src/entities/author.entity";

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private booksRepository: Repository<Book>,
    @InjectRepository(Author) private authorsRepository: Repository<Author>,
  ) {}

  findAll(): Promise<Book[]> {
    return this.booksRepository.find({ relations: ["author"] });
  }

  async create(
    book: { title: string; price: number; stock: number; authorId: number },
  ): Promise<Book> {
    const { title, price, stock, authorId } = book;

    const author = await this.authorsRepository.findOne({
      where: { id: authorId },
    });
    if (!author) {
      throw new Error("Author not found");
    }

    const newBook = this.booksRepository.create({
      title,
      price,
      stock,
      author,
    });
    return this.booksRepository.save(newBook);
  }
}
