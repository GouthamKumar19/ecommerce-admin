import { Order } from "../../types/order.types";

export const orderMockData: Order[] = [
  {
    _id: "66b3279c39c21f7342c125b4",
    orderId: "1001",
    customerId: "65d9f0f6d1e57b6d4b8b4569",
    customerDetails: {
      name: "John Doe",
    },
    total: 249.99,
    createdAt: "2025-02-15T14:45:00Z",
    paymentId: "66c3279c39c21f7342c126a1",
    paymentDetails: {
      status: "PENDING",
    },
    status: "Shipped",
    updatedAt: "2025-02-15T14:45:00Z",
  },
  {
    _id: "66b3279c39c21f7342c125b5",
    orderId: "1002",
    customerId: "65d9f0f6d1e57b6d4b8b4570",
    customerDetails: {
      name: "Jane Smith",
    },
    total: 1299.99,
    createdAt: "2025-02-20T09:15:00Z",
    paymentId: "66c3279c39c21f7342c126a2",
    paymentDetails: {
      status: "COMPLETE",
    },
    status: "Processing",
    updatedAt: "2025-02-20T09:15:00Z",
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
    _id: "66b3279c39c21f7342c125b6",
    orderId: "1003",
    customerId: "65d9f0f6d1e57b6d4b8b4571",
    customerDetails: {
      name: "Michael Jones",
    },
    total: 799.99,
    createdAt: "2025-02-22T10:30:00Z",
    paymentId: "66c3279c39c21f7342c126a3",
    paymentDetails: {
      status: "PENDING",
    },
    status: "Delivered",
    updatedAt: "2025-02-22T10:30:00Z",
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
    _id: "66b3279c39c21f7342c125b7",
    orderId: "1004",
    customerId: "65d9f0f6d1e57b6d4b8b4572",
    customerDetails: {
      name: "Linda Lee",
    },
    total: 299.99,
    createdAt: "2025-02-25T11:00:00Z",
    paymentId: "66c3279c39c21f7342c126a4",
    paymentDetails: {
      status: "COMPLETE",
    },
    status: "Shipped",
    updatedAt: "2025-02-25T11:00:00Z",
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
    _id: "66b3279c39c21f7342c125b8",
    orderId: "1005",
    customerId: "65d9f0f6d1e57b6d4b8b4573",
    customerDetails: {
      name: "David Wilson",
    },
    total: 349.99,
    createdAt: "2025-03-01T12:45:00Z",
    paymentId: "66c3279c39c21f7342c126a5",
    paymentDetails: {
      status: "FAILED",
    },
    status: "Processing",
    updatedAt: "2025-03-01T12:45:00Z",
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
    _id: "66b3279c39c21f7342c125b9",
    orderId: "1006",
    customerId: "65d9f0f6d1e57b6d4b8b4574",
    customerDetails: {
      name: "Susan Clark",
    },
    total: 1499.99,
    createdAt: "2025-03-05T14:00:00Z",
    paymentId: "66c3279c39c21f7342c126a6",
    paymentDetails: {
      status: "COMPLETE",
    },
    status: "Delivered",
    updatedAt: "2025-03-05T14:00:00Z",
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
    _id: "66b3279c39c21f7342c125ba",
    orderId: "1007",
    customerId: "65d9f0f6d1e57b6d4b8b4575",
    customerDetails: {
      name: "Robert Brown",
    },
    total: 179.99,
    createdAt: "2025-03-08T16:30:00Z",
    paymentId: "66c3279c39c21f7342c126a7",
    paymentDetails: {
      status: "PENDING",
    },
    status: "Shipped",
    updatedAt: "2025-03-08T16:30:00Z",
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
    _id: "66b3279c39c21f7342c125bb",
    orderId: "1008",
    customerId: "65d9f0f6d1e57b6d4b8b4576",
    customerDetails: {
      name: "Patricia Taylor",
    },
    total: 89.99,
    createdAt: "2025-03-10T13:15:00Z",
    paymentId: "66c3279c39c21f7342c126a8",
    paymentDetails: {
      status: "COMPLETE",
    },
    status: "Processing",
    updatedAt: "2025-03-10T13:15:00Z",
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
    _id: "66b3279c39c21f7342c125bc",
    orderId: "1009",
    customerId: "65d9f0f6d1e57b6d4b8b4577",
    customerDetails: {
      name: "Barbara Martin",
    },
    total: 149.99,
    createdAt: "2025-03-11T09:45:00Z",
    paymentId: "66c3279c39c21f7342c126a9",
    paymentDetails: {
      status: "FAILED",
    },
    status: "Delivered",
    updatedAt: "2025-03-11T09:45:00Z",
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
    _id: "66b3279c39c21f7342c125bd",
    orderId: "1010",
    customerId: "65d9f0f6d1e57b6d4b8b4578",
    customerDetails: {
      name: "James Anderson",
    },
    total: 159.99,
    createdAt: "2025-03-12T08:20:00Z",
    paymentId: "66c3279c39c21f7342c126aa",
    paymentDetails: {
      status: "COMPLETE",
    },
    status: "Shipped",
    updatedAt: "2025-03-12T08:20:00Z",
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
