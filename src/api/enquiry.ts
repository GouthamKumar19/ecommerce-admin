import axiosInstance from "./axios";
import axios from "axios";
import { Enquiry } from "../types/enquiry.types";

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

let currentController: AbortController;

export const getAllEnquiry = async (
  payload: any
): Promise<ApiResponse<Enquiry[]> | undefined> => {
  console.log("Payload received:", payload); // Log the payload for debugging

  try {
    if (currentController) {
      currentController.abort();
    }
    currentController = new AbortController();

    const response = await axiosInstance.post(
      "/admin/enquiries/getAll",
      payload,
      { signal: currentController.signal }
    );

    if (response.status === 200) {
      return {
        status: response.status,
        message: response.data.message,
        data: response.data.data.totalData,
      };
    } else {
      throw new Error("Failed to fetch enquiries");
    }
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    } else {
      console.error("[API] Error fetching all enquiries:", error);
      return undefined;
    }
  }
};