export interface CustomerDetails {
  name: string;
}

export interface PaymentDetails {
  status: string;
}

export interface Order {
  _id: string;
  orderId: string;
  customerId: string;
  customerDetails: CustomerDetails;
  total: number;
  createdAt: string;
  paymentId: string;
  paymentDetails: PaymentDetails;
  status: string;
  updatedAt: string;
  [key: string]: unknown; // Add index signature to satisfy Record<string, unknown>
}

export interface OrderResponse {
  status: number;
  message: string;
  data: {
    totalCount: number;
    tableData: Order[];
  };
}

// Add interface for filter props
export interface OrderFilters {
  paymentStatus: string[];
  orderStatus: string[];
  date: string;
}
