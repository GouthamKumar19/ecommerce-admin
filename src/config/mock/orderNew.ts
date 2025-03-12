import { Order } from "../../types/order.types";

export const orderMockData: Order[] = [
  {
    orderId: "1001",
    username: "john_doe",
    amount: 249.99,
    date: "2025-02-15T14:45:00Z",
    paymentStatus: "Pending",
    orderStatus: "Shipped",
    items: [
      {
        productId: "1",
        name: "Wireless Noise-Cancelling Headphones",
        quantity: 1,
        price: 199.99,
      },
    ],
  },
  {
    orderId: "1002",
    username: "jane_smith",
    amount: 1299.99,
    date: "2025-02-20T09:15:00Z",
    paymentStatus: "Complete",
    orderStatus: "Processing",
    items: [
      {
        productId: "3",
        name: "Professional DSLR Camera",
        quantity: 1,
        price: 1149.99,
      },
      {
        productId: "6",
        name: "Portable Bluetooth Speaker",
        quantity: 1,
        price: 99.99,
      },
    ],
  },
  {
    orderId: "1003",
    username: "michael_jones",
    amount: 799.99,
    date: "2025-02-22T10:30:00Z",
    paymentStatus: "Pending",
    orderStatus: "Delivered",
    items: [
      {
        productId: "2",
        name: 'Ultra HD Smart TV 55"',
        quantity: 1,
        price: 649.99,
      },
    ],
  },
  {
    orderId: "1004",
    username: "linda_lee",
    amount: 299.99,
    date: "2025-02-25T11:00:00Z",
    paymentStatus: "Complete",
    orderStatus: "Shipped",
    items: [
      {
        productId: "4",
        name: "Ergonomic Office Chair",
        quantity: 1,
        price: 249.99,
      },
    ],
  },
  {
    orderId: "1005",
    username: "david_wilson",
    amount: 349.99,
    date: "2025-03-01T12:45:00Z",
    paymentStatus: "Failed",
    orderStatus: "Processing",
    items: [
      {
        productId: "5",
        name: "Stainless Steel Smart Watch",
        quantity: 1,
        price: 299.99,
      },
    ],
  },
  {
    orderId: "1006",
    username: "susan_clark",
    amount: 1499.99,
    date: "2025-03-05T14:00:00Z",
    paymentStatus: "Complete",
    orderStatus: "Delivered",
    items: [
      {
        productId: "7",
        name: 'Ultra-Thin Laptop 15"',
        quantity: 1,
        price: 1299.99,
      },
    ],
  },
  {
    orderId: "1007",
    username: "robert_brown",
    amount: 179.99,
    date: "2025-03-08T16:30:00Z",
    paymentStatus: "Pending",
    orderStatus: "Shipped",
    items: [
      {
        productId: "8",
        name: "Professional Blender",
        quantity: 1,
        price: 149.99,
      },
    ],
  },
  {
    orderId: "1008",
    username: "patricia_taylor",
    amount: 89.99,
    date: "2025-03-10T13:15:00Z",
    paymentStatus: "Complete",
    orderStatus: "Processing",
    items: [
      {
        productId: "9",
        name: "Smart Home Security Camera",
        quantity: 1,
        price: 69.99,
      },
    ],
  },
  {
    orderId: "1009",
    username: "barbara_martin",
    amount: 149.99,
    date: "2025-03-11T09:45:00Z",
    paymentStatus: "Failed",
    orderStatus: "Delivered",
    items: [
      {
        productId: "10",
        name: "Mechanical Gaming Keyboard",
        quantity: 1,
        price: 129.99,
      },
    ],
  },
  {
    orderId: "1010",
    username: "james_anderson",
    amount: 159.99,
    date: "2025-03-12T08:20:00Z",
    paymentStatus: "Complete",
    orderStatus: "Shipped",
    items: [
      {
        productId: "11",
        name: "Wireless Earbuds",
        quantity: 1,
        price: 129.99,
      },
    ],
  },
];
