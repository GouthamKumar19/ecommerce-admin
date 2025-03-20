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
