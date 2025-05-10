import { Component } from '@angular/core';
import { CartComponent } from "../../components/cart/cart.component";

@Component({
  standalone: true,
  selector: 'app-cart-page',
  template: '<app-cart></app-cart>',
  imports: [CartComponent],
})
export class CartPage {}
