// import axiosInstance from "./axios";
import { OrderNew } from "../types/orders.types";
import { Order } from "../types/order.types";
import { orderMockData } from "../config/mock/orderNew";
import { mockOrders } from "../config/mock/ordersData";

interface ApiResponse<T> {
  status: number;
  message: string;
  data: {
    totalCount: number;
    tableData: T[];
  };
}

// Get all orders
export const getAllOrders = async (): Promise<ApiResponse<Order>> => {
  try {
    console.log("[API] Fetching all orders");

    // Uncomment when API is ready
    // const response = await axiosInstance.get('/admin/orders/getAll');
    // return response.data;

    // Mock response
    const mockResponse: ApiResponse<Order> = {
      status: 200,
      message: "Success",
      data: orderMockData.data,
    };

    console.log("[API] Mock getAll response:", mockResponse);
    return Promise.resolve(mockResponse);
  } catch (error) {
    console.error("[API] Error fetching all orders:", error);
    throw error;
  }
};

// Get an order by ID
export const getOrderById = async (
  id: string
): Promise<ApiResponse<OrderNew>> => {
  try {
    console.log("[API] Fetching order with ID:", id);

    // Find order from the mockOrders array you provided
    const order = mockOrders.find(
      (order) => order._id === id || order.orderId === id
    );

    if (!order) {
      throw new Error("Order not found");
    }

    const mockResponse: ApiResponse<OrderNew> = {
      status: 200,
      message: "Success",
      data: {
        totalCount: 1,
        tableData: [order],
      },
    };

    console.log("[API] Mock get response:", mockResponse);
    return Promise.resolve(mockResponse);
  } catch (error) {
    console.error("[API] Error fetching order:", error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (
  orderId: string,
  status: string
): Promise<ApiResponse<OrderNew>> => {
  try {
    console.log("[API] Updating order status:", { orderId, status });

    // Uncomment when API is ready
    // const response = await axiosInstance.patch(`/admin/orders/${orderId}/status`, { status });
    // return response.data;

    // Mock response
    const order = orderMockData.data.tableData.find((t) => t._id === orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    const updatedOrder = {
      ...order,
      status: status,
      updatedAt: new Date().toISOString(),
    };

    const mockResponse: ApiResponse<OrderNew> = {
      status: 200,
      message: "Order status updated successfully",
      data: {
        totalCount: 1,
        // @ts-ignore
        tableData: [updatedOrder],
      },
    };

    console.log("[API] Mock update status response:", mockResponse);
    return Promise.resolve(mockResponse);
  } catch (error) {
    console.error("[API] Error updating order status:", error);
    throw error;
  }
};

// Update payment status
export const updatePaymentStatus = async (
  orderId: string,
  paymentStatus: string
): Promise<ApiResponse<OrderNew>> => {
  try {
    console.log("[API] Updating payment status:", { orderId, paymentStatus });

    // Uncomment when API is ready
    // const response = await axiosInstance.patch(`/admin/orders/${orderId}/payment-status`, { status: paymentStatus });
    // return response.data;

    // Mock response
    const order = orderMockData.data.tableData.find((t) => t._id === orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    const updatedOrder = {
      ...order,
      paymentDetails: {
        ...order.paymentDetails,
        status: paymentStatus,
      },
      updatedAt: new Date().toISOString(),
    };

    const mockResponse: ApiResponse<OrderNew> = {
      status: 200,
      message: "Payment status updated successfully",
      data: {
        totalCount: 1,
        // @ts-ignore
        tableData: [updatedOrder],
      },
    };

    console.log("[API] Mock update payment status response:", mockResponse);
    return Promise.resolve(mockResponse);
  } catch (error) {
    console.error("[API] Error updating payment status:", error);
    throw error;
  }
};

// Get orders by date range
export const getOrdersByDateRange = async (
  startDate: string,
  endDate: string
): Promise<ApiResponse<Order>> => {
  try {
    console.log("[API] Fetching orders by date range:", { startDate, endDate });

    // Uncomment when API is ready
    // const response = await axiosInstance.get(`/admin/orders/by-date?startDate=${startDate}&endDate=${endDate}`);
    // return response.data;

    // Mock response
    const filteredOrders = orderMockData.data.tableData.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });

    const mockResponse: ApiResponse<Order> = {
      status: 200,
      message: "Success",
      data: {
        totalCount: filteredOrders.length,
        tableData: filteredOrders,
      },
    };

    console.log("[API] Mock date range response:", mockResponse);
    return Promise.resolve(mockResponse);
  } catch (error) {
    console.error("[API] Error fetching orders by date range:", error);
    throw error;
  }
};
