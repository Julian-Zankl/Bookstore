import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Book } from 'src/entities/book.entity';
import { OrderItem } from 'src/entities/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Book])],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
