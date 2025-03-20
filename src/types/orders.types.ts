// types.ts

export interface Address {
  name: string;
  zipCode: string;
  streetAddress: string;
}

export interface Product {
  id: string;
  brand: string;
  name: string;
  image: string;
  discount: number;
  currentPrice: number;
  originalPrice: number;
}

export type PaymentStatus = "Pending" | "Complete" | "Failed";

export type OrderStatus =
  | "Shipped"
  | "Order Placed"
  | "Processing"
  | "Order Confirmed"
  | "Delivered"
  | "Cancelled"
  | "Ready To Ship";

export interface Order {
  id: string;
  customerName: string;
  shippingAddress: Address;
  billingAddress: Address;
  products: Product[];
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  orderDate: string;
}
