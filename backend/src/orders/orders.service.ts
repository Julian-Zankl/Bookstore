import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderItem } from 'src/entities/order-item.entity';
import { Book } from 'src/entities/book.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = new Order();
    order.createdAt = new Date();
    order.total = 0;

    const savedOrder = await this.orderRepository.save(order);

    let total = 0;
    const orderItems: OrderItem[] = [];

    for (const item of createOrderDto.items) {
      // Fetch the book price using the bookId
      const book = await this.bookRepository.findOne({
        where: { id: item.bookId },
      });

      if (!book) {
        throw new Error(`Book with ID ${item.bookId} not found`);
      }

      if (book.stock < item.quantity) {
        throw new Error(`Not enough stock for book "${book.title}"`);
      }

      const orderItem = new OrderItem();
      orderItem.bookId = book.id;
      orderItem.quantity = item.quantity;
      orderItem.order = savedOrder;

      total += book.price * item.quantity;

      orderItems.push(orderItem);

      book.stock -= item.quantity;
      await this.bookRepository.save(book);
    }

    await this.orderItemRepository.save(orderItems);

    savedOrder.total = total;
    return this.orderRepository.save(savedOrder);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['items'] });
  }
}
