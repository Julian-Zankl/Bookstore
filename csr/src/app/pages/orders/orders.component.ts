import { Component } from '@angular/core';
import { OrderSummaryComponent } from "../../components/order-summary/order-summary.component";

@Component({
  standalone: true,
  selector: 'app-orders',
  imports: [OrderSummaryComponent],
  template: '<app-order-summary></app-order-summary>',
})
export class OrdersPage {}
