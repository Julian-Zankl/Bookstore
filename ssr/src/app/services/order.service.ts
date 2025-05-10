import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';
import { environment } from '../../environment/environment';
import { CreateOrderDto, CreateOrderResponse } from '../dto/create-order.dto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient)

  placeOrder(order: CreateOrderDto): Observable<CreateOrderResponse> {
    return this.http.post<any>(`${environment.api}/orders`, order);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.api}/orders`);
  }
}
