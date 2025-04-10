export interface Address {
  userId: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pinCode: string;
  isShipping: boolean;
  isDefault: boolean;
}

export interface Variant {
  _id: string;
  name: string;
  value: string;
  variantId: string;
}

export interface ProductDetails {
  _id: string;
  name: string;
  description: string;
  price: number;
  slashedPrice: number;
  isFeatured: boolean;
  categoryId: string;
  subCategoryId: string;
  images: string[];
  thumbnailImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderProduct {
  productDetails: ProductDetails;
  productId: string;
  price: number;
  quantity: number;
  amount: number;
  variants: Variant[];
}

export interface CustomerDetails {
  name: string;
}

export interface PaymentDetails {
  status: PaymentStatus;
}

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export type OrderStatus =
  | "SHIPPED"
  | "ORDER_PLACED"
  | "PROCESSING"
  | "ORDER_CONFIRMED"
  | "DELIVERED"
  | "CANCELLED"
  | "READY_TO_SHIP";

export interface OrderNew {
  // Changed from Order to OrderNew
  _id: string;
  orderId: string;
  customerId: string;
  customerDetails: CustomerDetails;
  shippingAddressId: string;
  shippingAddress: Address;
  billingAddressId: string;
  billingAddress: Address;
  products: OrderProduct[];
  status: OrderStatus;
  paymentId: string;
  paymentDetails: PaymentDetails;
  createdAt: string;
  updatedAt: string;
}
