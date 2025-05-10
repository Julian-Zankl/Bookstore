import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { firstValueFrom } from 'rxjs';
import { OrderBooksPipe } from "../../pipes/order-books.pipe";

@Component({
  standalone: true,
  selector: 'app-order-summary',
  imports: [CommonModule, OrderBooksPipe],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent implements OnInit {
  private orderService = inject(OrderService);

  protected orders: Order[] = [];
  protected loading = true;

  ngOnInit() {
    this.fetchOrders();
  }

  private fetchOrders() {
    firstValueFrom(this.orderService.getOrders()).then((orders) => {
      this.orders = orders;
      this.loading = false;
    }).catch((error) => {
      console.error('Error fetching orders', error);
      this.loading = false;
    });
  }
}
