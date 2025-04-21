import { OrderItem } from './order-item.model';

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: Date;
}
