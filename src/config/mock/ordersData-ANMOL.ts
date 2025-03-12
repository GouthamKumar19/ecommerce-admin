// mockData.ts
import { Order, PaymentStatus, OrderStatus } from "../../types/orders.types";

// Import your image - adjust the path as needed
import productImage from "/src/assets/orders/image.png";

export const mockOrders: Order[] = [
  {
    id: "ORD12345",
    customerName: "User Name",
    shippingAddress: {
      name: "Sahana",
      zipCode: "576107",
      streetAddress: "Laxmingara kodavoor garde",
    },
    billingAddress: {
      name: "Saiju Shetty",
      zipCode: "576109",
      streetAddress: "Laxmingara kodavoor garde",
    },
    products: [
      {
        id: "PROD001",
        brand: "PUMA",
        name: "WHITE SPORTS SHOES",
        image: productImage,
        discount: 50,
        currentPrice: 50,
        originalPrice: 100,
      },
      {
        id: "PROD002",
        brand: "PUMA",
        name: "WHITE SPORTS SHOES",
        image: productImage,
        discount: 50,
        currentPrice: 50,
        originalPrice: 100,
      },
      {
        id: "PROD003",
        brand: "PUMA",
        name: "WHITE SPORTS SHOES",
        image: productImage,
        discount: 50,
        currentPrice: 50,
        originalPrice: 100,
      },
    ],
    paymentStatus: "Pending",
    orderStatus: "Order Placed",
    orderDate: "2025-03-01",
  },
];

// Helper function to get a single order by ID
export const getOrderById = (orderId: string): Order | undefined => {
  return mockOrders.find((order) => order.id === orderId);
};

// Export all available payment statuses
export const paymentStatuses: PaymentStatus[] = [
  "Pending",
  "Complete",
  "Failed",
];

// Export all available order statuses
export const orderStatuses: OrderStatus[] = [
  "Shipped",
  "Order Placed",
  "Processing",
  "Order Confirmed",
  "Delivered",
  "Cancelled",
  "Ready To Ship",
];
