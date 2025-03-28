import axiosInstance from "./axios";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  toastMessage?: string;
}

export const logout = async (): Promise<ApiResponse<string>> => {
  try {
    // Retrieve tokens from cookies
    const accessToken = Cookies.get('access_token');
    const refresh_token = Cookies.get('refresh_token');

    // Validate tokens exist
    if (!refresh_token) {
      throw new Error("No refresh token found");
    }


    // Perform logout API call
    const response = await axiosInstance.post('/admin/auth/logout', 
      { refresh_token: refresh_token }, 
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );


    // Clear all cookies after successful logout
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('user_id');
    Cookies.remove('user_name');
    Cookies.remove('user_email');
    Cookies.remove('user_role');

    // Return the API response
    return {
      status: response.data.status,
      message: response.data.message,
      data: response.data.data || "Logout Successful",
      toastMessage: response.data.toastMessage || "Logout Successful"
    };
  } catch (error) {
    console.group("Logout API Error");
    
    // More specific error handling
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {
        // Server responded with an error
        console.error("Server Error Response:", axiosError.response.data);
        throw new Error((axiosError.response.data as any)?.message || "Logout failed");
      } else if (axiosError.request) {
        // Request made but no response received
        console.error("No response received from server");
        throw new Error("No response received from server");
      } else {
        // Error in setting up the request
        console.error("Error setting up logout request:", error);
        throw new Error("Error setting up logout request");
      }
    }

    // Fallback error handling
    console.error("Unexpected logout error:", error);
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred during logout"
    );
  } finally {
    console.groupEnd();
  }
};