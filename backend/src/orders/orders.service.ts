import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Book } from '../entities/book.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({ relations: ['book'] });
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { bookId, quantity } = createOrderDto;

    // Start a transaction to ensure data integrity
    return await this.dataSource.transaction(async (manager) => {
      // Retrieve the book within the transaction
      const book = await manager.findOne(Book, { where: { id: bookId } });
      if (!book) {
        throw new NotFoundException('Book not found');
      }

      // Check if enough stock is available
      if (book.stock < quantity) {
        throw new BadRequestException('Not enough stock available');
      }

      // Reduce the book's stock
      book.stock -= quantity;
      await manager.save(book);

      // Calculate total price
      const total = +book.price * quantity;

      // Create the order
      const order = manager.create(Order, {
        book,
        quantity,
        total,
      });

      // Save the order and return it
      return await manager.save(order);
    });
  }
}
