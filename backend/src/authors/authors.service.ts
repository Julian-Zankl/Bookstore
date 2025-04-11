import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Author } from "../entities/author.entity";
import { AuthorDto } from "src/orders/dto/author.dto";

@Injectable()
export class AuthorsService {
    constructor(
        @InjectRepository(Author) private authorsRepository: Repository<Author>,
    ) {}

    async findAll(): Promise<AuthorDto[]> {
        const authors = await this.authorsRepository.find({
            relations: ["books"],
        });

        return authors.map((author) => ({
            id: author.id,
            name: author.name,
            books: author.books.map((book) => ({
                id: book.id,
                title: book.title,
                price: book.price,
                stock: book.stock,
            })),
        }));
    }

    create(name: string): Promise<Author> {
        const author = this.authorsRepository.create({ name });
        return this.authorsRepository.save(author);
    }
}
