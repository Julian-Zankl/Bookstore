import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getOrders(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }
}
