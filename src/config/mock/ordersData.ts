import { Order, PaymentStatus, OrderStatus } from "../../types/orders.types";

export const mockOrders: Order[] = [
  {
    _id: "66b3279c39c21f7342c125b4",
    orderId: "P123",
    customerId: "65d9f0f6d1e57b6d4b8b4599",
    customerDetails: {
      name: "John Doe",
    },
    shippingAddressId: "65d9f0f6d1e57b6d4b8b4569",
    shippingAddressDetails: {
      userId: "65d9f0f6d1e57b6d4b8b4599",
      line1: "123 Main St",
      line2: "Apt 4B",
      city: "New York",
      state: "NY",
      pinCode: "10001",
      isShipping: true,
      isDefault: false,
    },
    billingAddressId: "65d9f0f6d1e57b6d4b8b4569",
    billingAddressDetails: {
      userId: "65d9f0f6d1e57b6d4b8b4599",
      line1: "123 Main St",
      line2: "Apt 4B",
      city: "New York",
      state: "NY",
      pinCode: "10001",
      isShipping: false,
      isDefault: true,
    },
    products: [
      {
        productDetails: {
          _id: "65f3a2cde9b45a7d4c5b6789",
          name: "Laptop",
          description: "High-performance laptop with 16GB RAM",
          price: 1200.99,
          slashedPrice: 999.99,
          isFeatured: false,
          categoryId: "65d9f0f6d1e57b6d4b8b4571",
          subCategoryId: "65d9f0f6d1e57b6d4b8b4572",
          images: [
            "/products/winter-jacket1.jpg",
            "/products/winter-jacket2.jpg",
          ],
          thumbnailImage: "/products/thumbnail.jpg",
          createdAt: "2025-02-05T07:30:00Z",
          updatedAt: "2025-02-06T08:00:00Z",
        },
        productId: "65f3a2cde9b45a7d4c5b6789",
        price: 1200.99,
        quantity: 1,
        amount: 1200.99,
        variants: [
          {
            _id: "65d9f0f6d1e57b6d4b8b4576",
            name: "Color",
            value: "Black",
            variantId: "65d9f0f6d1e57b6d4b8b4577",
          },
        ],
      },
    ],
    status: "SHIPPED",
    paymentId: "65d9f0f6d1e57b6d4b8b4571",
    paymentDetails: {
      status: "COMPLETED",
    },
    createdAt: "2025-02-05T07:30:00Z",
    updatedAt: "2025-02-06T08:00:00Z",
  },
];

export const paymentStatuses: PaymentStatus[] = [
  "PENDING",
  "COMPLETED",
  "FAILED",
];

export const orderStatuses: OrderStatus[] = [
  "SHIPPED",
  "ORDER_PLACED",
  "PROCESSING",
  "ORDER_CONFIRMED",
  "DELIVERED",
  "CANCELLED",
  "READY_TO_SHIP",
];

export const getOrderById = (orderId: string): Order | undefined => {
  return mockOrders.find((order) => order.orderId === orderId);
};
