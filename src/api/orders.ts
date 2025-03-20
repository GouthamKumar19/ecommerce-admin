import { Order } from "../types/order.types";
import { orderMockData } from "../config/mock/orderMockData";

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Get all orders
export const getAllOrders = async (): Promise<ApiResponse<Order[]>> => {
  try {
    console.log("[API] Fetching all orders");

    // Uncomment when API is ready
    // const response = await axiosInstance.get('/admin/orders/getAll');
    // return response.data;

    // Mock response
    const mockResponse: ApiResponse<Order[]> = {
      status: 200,
      message: "Success",
      data: orderMockData,
    };

    console.log("[API] Mock getAll orders response:", mockResponse);
    return Promise.resolve(mockResponse);
  } catch (error) {
    console.error("[API] Error fetching all orders:", error);
    throw error;
  }
};

// Get an order by ID
export const getOrderById = async (id: string): Promise<ApiResponse<Order>> => {
  try {
    console.log("[API] Fetching order with ID:", id);

    // Uncomment when API is ready
    // const response = await axiosInstance.get(`/admin/orders/getOne/${id}`);
    // return response.data;

    // Mock response using orderMockData
    const order = orderMockData.find((o) => o._id === id || o.orderId === id);

    if (!order) {
      throw new Error("Order not found");
    }

    const mockResponse: ApiResponse<Order> = {
      status: 200,
      message: "Success",
      data: order,
    };

    console.log("[API] Mock getOne order response:", mockResponse);
    return Promise.resolve(mockResponse);
  } catch (error) {
    console.error("[API] Error fetching order:", error);
    throw error;
  }
};
