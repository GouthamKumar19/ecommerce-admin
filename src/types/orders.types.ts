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

export interface ProductVariant {
  _id: string;
  name: string;
  value: string;
  variantId: string;
}

export interface Product {
  productDetails: ProductDetails;
  productId: string;
  price: number;
  quantity: number;
  variants: ProductVariant[];
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
  _id: string;
  orderId: string;
  customerId: string;
  customerDetails: {
    name: string;
  };
  shippingAddressId: string;
  shippingAddressDetails: Address;
  billingAddressId: string;
  billingAddressDetails: Address;
  products: Product[];
  status: OrderStatus;
  paymentId: string;
  paymentDetails: {
    status: PaymentStatus;
  };
  createdAt: string;
  updatedAt: string;
}
