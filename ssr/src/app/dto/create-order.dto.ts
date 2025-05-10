import { CartItem } from "../models/cart-item.model";

export interface CreateOrderDto {
  items: CartItem[];
}

export interface CreateOrderResponse {
  id: string;
  total: number;
  createdAt: string;
}
