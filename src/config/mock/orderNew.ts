import { OrderResponse } from "../../types/order.types";

export const orderMockData: OrderResponse = {
  status: 200,
  message: "Success",
  data: {
    totalCount: 2,
    tableData: [
      {
        _id: "66b3279c39c21f7342c125b4",
        orderId: "P123",
        customerId: "65d9f0f6d1e57b6d4b8b4569",
        customerDetails: {
          name: "John Doe",
        },
        total: 199.99,
        createdAt: "2025-02-05T07:30:00Z",
        paymentId: "66c3279c39c21f7342c126a1",
        paymentDetails: {
          status: "PENDING",
        },
        status: "PROCESSING",
        updatedAt: "2025-02-06T08:00:00Z",
      },
      {
        _id: "66b3279c39c21f7342c152c5",
        orderId: "P124",
        customerId: "65d9f0f6d1e57b6d4b8b4570",
        customerDetails: {
          name: "Jane Smith",
        },
        total: 249.5,
        createdAt: "2025-02-06T11:00:00Z",
        paymentId: "66c3279c39c21f7342c126a2",
        paymentDetails: {
          status: "COMPLETED",
        },
        status: "SHIPPED",
        updatedAt: "2025-02-06T12:30:00Z",
      },
      
    ],
  },
};
