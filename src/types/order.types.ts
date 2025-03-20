export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export type Order = {
  _id: string;
  orderId: string;
  customerId: string;
  customerDetails: {
    name: string;
  };
  total: number;
  createdAt: string;
  paymentId: string;
  paymentDetails: {
    status: string;
  };
  status: string;
  updatedAt: string;
  items?: OrderItem[]; // Optional property to include order items if present
};
