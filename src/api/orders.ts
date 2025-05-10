import axiosInstance from "./axios";
import { Order } from "../types/order.types";
import { SortConfig } from "../types/order.types";
import { OrderNew } from "@/types/orders.types";
let currentController: AbortController | null = null;

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  toastMessage?: string;
}

export const getAllOrders = async (
  page: number,
  itemsPerPage: number,
  searchTerm: string,
  sortConfig: SortConfig,
  filters?: {
    filter?: {
      status?: string[];
      paymentStatus?: string[];
    };
    dateRange?: {
      fromDate: number;
      toDate: number;
    };
  }
): Promise<ApiResponse<{ totalCount: number; tableData: Order[] }>> => {
  try {
    if (currentController) {
      currentController.abort();
    }
    currentController = new AbortController();
    console.log("[API] Fetching all orders with filters:", filters);

    const response = await axiosInstance.post(
      "/admin/orders/getAll",
      {
        search: [
          {
            term: searchTerm,
            fields: ["orderId", "customerDetails.name", "status"],
            startsWith: true,
            endsWith: false,
          },
        ],
        options: {
          sortBy: [sortConfig.key],
          sortDesc: [sortConfig.direction === "descending"],
          page,
          itemsPerPage,
        },
        filter: {
          ...filters?.filter, // Spread other filters
        },
        ...(filters?.dateRange && { ...filters.dateRange }), // Spread dateRange if it exists
      },
      {
        signal: currentController.signal,
      }
    );

    return response.data;
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

    const response = await axiosInstance.post(`/admin/orders/getOne/${id}`);
    return response.data;
  } catch (error) {
    console.error("[API] Error fetching order:", error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (
  orderId: string,
  status: string
): Promise<ApiResponse<string>> => {
  if (
    ![
      "SHIPPED",
      "PLACED",
      "CONFIRMED",
      "ORDER PLACED",
      "PROCESSING",
      "READY TO SHIP",
      "DELIVERED",
      "CANCELLED",
    ].includes(status)
  ) {
    throw new Error("Invalid order status");
  }

  try {
    console.log("[API] Updating order status:", { orderId, status });

    const response = await axiosInstance.put(
      `/admin/orders/update/${orderId}`,
      { orderStatus: status }
    );
    return response.data;
  } catch (error) {
    console.error("[API] Error updating order status:", error);
    throw error;
  }
};

// Update payment status
export const updatePaymentStatus = async (
  orderId: string,
  paymentStatus: string
): Promise<ApiResponse<string>> => {
  if (!["PENDING", "COMPLETED", "FAILED"].includes(paymentStatus)) {
    throw new Error("Invalid payment status");
  }

  try {
    console.log("[API] Updating payment status:", { orderId, paymentStatus });

    const response = await axiosInstance.put(
      `/admin/orders/update/${orderId}`,
      { paymentStatus }
    );
    return response.data;
  } catch (error) {
    console.error("[API] Error updating payment status:", error);
    throw error;
  }
};

// Get orders by date range
export const getOrdersByDateRange = async (
  fromDate: number,
  toDate: number
): Promise<ApiResponse<{ totalCount: number; tableData: Order[] }>> => {
  try {
    
    const response = await axiosInstance.post<ApiResponse<{ totalCount: number; tableData: Order[] }>>(
      "/admin/orders/getAll",
      { fromDate, toDate }
    );

    return response.data; 
  } catch (error) {
    console.error("[API] Error fetching orders by date range:", error);
    throw error;
  }
};