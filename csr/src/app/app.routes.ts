import { Routes } from '@angular/router';
import { BookDetailPage } from './pages/book-detail/book-detail.component';
import { BooksPage } from './pages/books/books.component';
import { CartPage } from './pages/cart/cart.component';
import { OrdersPage } from './pages/orders/orders.component';
import { OrderSuccessComponent } from './pages/order-success/order-success.component';

export const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: 'books', component: BooksPage },
  { path: 'books/:id', component: BookDetailPage },
  { path: 'cart', component: CartPage },
  { path: 'orders', component: OrdersPage },
  { path: 'success', component: OrderSuccessComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
