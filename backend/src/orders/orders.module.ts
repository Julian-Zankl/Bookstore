import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Book } from 'src/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Book])],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
