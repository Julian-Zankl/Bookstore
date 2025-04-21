import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from 'src/entities/author.entity';
import { Book } from 'src/entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  async seed() {
    const existingAuthors = await this.authorRepository.find();

    if (existingAuthors.length > 0) {
      console.log('Authors already exist, skipping author creation...');
    } else {
      const authorsData = [
        { name: 'George Lucas' },
        { name: 'J.K. Rowling' },
        { name: 'George R.R. Martin' },
      ];

      const authors = this.authorRepository.create(authorsData);
      await this.authorRepository.save(authors);
      console.log('Authors created!');
    }

    const [georgeLucas, jkRowling, georgeRRMartin] =
      await this.authorRepository.find();

    const booksData = [
      {
        title: 'Star Wars: A New Hope',
        price: 19.99,
        stock: 100,
        author: georgeLucas,
      },
      {
        title: 'Star Wars: The Empire Strikes Back',
        price: 19.99,
        stock: 100,
        author: georgeLucas,
      },
      {
        title: 'Star Wars: Return of the Jedi',
        price: 19.99,
        stock: 100,
        author: georgeLucas,
      },
      {
        title: 'Star Wars: The Phantom Menace',
        price: 19.99,
        stock: 100,
        author: georgeLucas,
      },
      {
        title: 'Star Wars: Attack of the Clones',
        price: 19.99,
        stock: 100,
        author: georgeLucas,
      },

      {
        title: "Harry Potter and the Sorcerer's Stone",
        price: 29.99,
        stock: 150,
        author: jkRowling,
      },
      {
        title: 'Harry Potter and the Chamber of Secrets',
        price: 29.99,
        stock: 150,
        author: jkRowling,
      },
      {
        title: 'Harry Potter and the Prisoner of Azkaban',
        price: 29.99,
        stock: 150,
        author: jkRowling,
      },
      {
        title: 'Harry Potter and the Goblet of Fire',
        price: 29.99,
        stock: 150,
        author: jkRowling,
      },
      {
        title: 'Harry Potter and the Order of the Phoenix',
        price: 29.99,
        stock: 150,
        author: jkRowling,
      },

      {
        title: 'A Game of Thrones',
        price: 24.99,
        stock: 120,
        author: georgeRRMartin,
      },
      {
        title: 'A Clash of Kings',
        price: 24.99,
        stock: 120,
        author: georgeRRMartin,
      },
      {
        title: 'A Storm of Swords',
        price: 24.99,
        stock: 120,
        author: georgeRRMartin,
      },
      {
        title: 'A Feast for Crows',
        price: 24.99,
        stock: 120,
        author: georgeRRMartin,
      },
      {
        title: 'A Dance with Dragons',
        price: 24.99,
        stock: 120,
        author: georgeRRMartin,
      },
    ];

    const existingBooks = await this.bookRepository.find();

    if (existingBooks.length === 0) {
      const books = this.bookRepository.create(booksData);
      await this.bookRepository.save(books);
      console.log('Books created!');
    } else {
      console.log('Books already exist, skipping book creation...');
    }
  }
}
