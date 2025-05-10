import { Author } from './author.model';

export interface Book {
  id: string;
  title: string;
  price: number;
  stock: number;
  author: Author;
}
