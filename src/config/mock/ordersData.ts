import { Order, PaymentStatus, OrderStatus } from "../../types/orders.types";

// Import your image - adjust the path as needed
// import productImage from "/src/assets/orders/image.png";

export const mockOrders: Order[] = [
  {
    _id: "66b3279c39c21f7342c125b4",
    orderId: "ORD12345",
    customerId: "65d9f0f6d1e57b6d4b8b4569",
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
          thumbnailImage: "/src/assets/orders/image.png",
          createdAt: "2025-02-05T07:30:00Z",
          updatedAt: "2025-02-06T08:00:00Z",
        },
        productId: "65f3a2cde9b45a7d4c5b6789",
        price: 1200.99,
        quantity: 1,
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
    status: "Shipped",
    paymentId: "65d9f0f6d1e57b6d4b8b4571",

    paymentDetails: {
      status: "Complete",
    },

    createdAt: "2025-02-15T14:45:00Z",
    updatedAt: "2025-02-15T14:45:00Z",
  },
];

// Helper function to get a single order by ID
export const getOrderById = (orderId: string): Order | undefined => {
  return mockOrders.find((order) => order._id === orderId);
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
