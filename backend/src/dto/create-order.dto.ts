export class CreateOrderDto {
  readonly items: Array<{
    bookId: string;
    quantity: number;
  }>;
}
