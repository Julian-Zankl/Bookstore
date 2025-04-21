import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthorsService } from "./authors.service";
import { Author } from "../entities/author.entity";
import { AuthorDto } from "src/dto/author.dto";

@Controller("authors")
export class AuthorsController {
    constructor(private readonly authorsService: AuthorsService) {}

    @Get()
    getAuthors(): Promise<AuthorDto[]> {
        return this.authorsService.findAll();
    }

    @Post()
    addAuthor(@Body("name") name: string): Promise<Author> {
        return this.authorsService.create(name);
    }
}
