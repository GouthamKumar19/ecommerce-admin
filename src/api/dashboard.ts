import axiosInstance from "./axios";
import { DataResponse } from "@/types/dashboard.types";

export interface ApiResponse {
  status: number;
  message: string;
  data: DataResponse;
  environment: string;
}
export interface GetStatsRequest {
  filter?: string;
  startDate?: string;
  endDate?: string;
}

// Update the getStats function to handle the nested response
export const getStats = async (data: GetStatsRequest): Promise<DataResponse> => {
  try {
    const response = await axiosInstance.post<ApiResponse>(
      "/admin/dashboard/getStats",
      data
    );
    return response.data.data; // Extract the nested data object
  } catch (error) {
    console.error("Error fetching dashboard stats", error);
    throw error;
  }
};