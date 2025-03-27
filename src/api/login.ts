import { LoginRequest, LoginResponse } from "../types/loginTypes";
import axiosInstance from "./axios";

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  environment?: string;
}

export const login = async (
  loginData: LoginRequest
): Promise<ApiResponse<LoginResponse>> => {
  try {
    console.group("Login API Request");
    console.log("Login Request Data:", loginData);
    console.groupEnd();

    // Direct API call for login with detailed logging
    const response = await axiosInstance.post('/admin/auth/login', loginData, {
      // Add these headers for more detailed network logging
      headers: {
        'X-Detailed-Logging': 'true'
      }
    });
    
    // Detailed console logging
    console.group("Login API Response");
    console.log("Full Response Status:", response.status);
    console.log("Response Message:", response.data.message);
    console.log("Environment:", response.data.environment);
    
    // Log user details separately
    console.group("User Details");
    console.log("User ID:", response.data.data._id);
    console.log("Name:", response.data.data.name);
    console.log("Email:", response.data.data.email);
    console.log("Role:", response.data.data.role);
    console.groupEnd();
    
    // Log tokens (avoid logging full tokens in production)
    console.group("Token Information");
    console.log("Access Token (first 20 chars):", response.data.data.access_token.substring(0, 20) + "...");
    console.log("Refresh Token (first 20 chars):", response.data.data.refresh_token.substring(0, 20) + "...");
    console.log("Refresh Expires At:", response.data.data.refreshExpiresAt);
    console.groupEnd();
    
    console.groupEnd();

    // Optionally, you can also log to the network tab using console.table
    console.table({
      status: response.data.status,
      message: response.data.message,
      environment: response.data.environment,
      userId: response.data.data._id,
      userName: response.data.data.name,
      userEmail: response.data.data.email,
      userRole: response.data.data.role
    });

    return response.data;

  } catch (error) {
    console.group("Login API Error");
    console.error("Detailed Error:", error);
    console.groupEnd();

    throw error;
  }
};