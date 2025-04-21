import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Author } from './author.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('decimal')
  price: number;

  @Column('int')
  stock: number;

  @ManyToOne(() => Author, (author) => author.books, { eager: true })
  author: Author;
}
