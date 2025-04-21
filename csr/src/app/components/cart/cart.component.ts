import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { OrderService } from '../../services/order.service';
import { CreateOrderDto, CreateOrderResponse } from '../../dto/create-order.dto';
import { firstValueFrom } from 'rxjs';
import { CartBooksPipe } from '../../pipes/cart-books.pipe';

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule, CartBooksPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);

  protected items: CartItem[] = [];
  protected totalAmount = 0;

  ngOnInit() {
    this.items = this.cartService.getItems();
    this.fetchTotal();
  }

  protected checkout() {
    if (this.items.length === 0) {
      return;
    };

    const order: CreateOrderDto = {
      items: this.items
    };

    firstValueFrom(this.orderService.placeOrder(order)).then((response: CreateOrderResponse) => {
      console.log(`Order was created: ${response}`);
      this.cartService.clearCart();
      this.items = [];
    }).catch((error: unknown) => {
      console.error('Failed to place order:', error);
    });
  }

  protected updateQuantity(bookId: string, quantity: number) {
    this.cartService.updateQuantity(bookId, quantity);
    this.items = this.cartService.getItems();
    this.fetchTotal();
  }

  protected clearCart() {
    this.cartService.clearCart();
    this.items = [];
    this.totalAmount = 0;
  }

  private async fetchTotal() {
    this.totalAmount = await this.cartService.getTotal();
  }
}
