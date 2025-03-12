export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export type Order = {
  orderId: string;
  username: string;
  amount: number;
  date: string;
  paymentStatus: string;
  orderStatus: string;
  [key: string]: unknown; // Use 'unknown' instead of 'any'
};
