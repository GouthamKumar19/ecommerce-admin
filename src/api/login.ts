import { LoginRequest, LoginResponse } from "../types/loginTypes";
import axiosInstance from "./axios";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

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
        'X-Detailed-Logging': 'true',
        'Access-Control-Allow-Origin': '*'
      },
      withCredentials: true // Ensure withCredentials is set to true
    });

    // Detailed console logging
    console.group("Login API Response");
    console.log("Full Response Status:", response.status);
    console.log("Response Message:", response.data.message);
    console.log("Environment:", response.data.environment);

    // Store user data in cookies
    const userData = response.data.data;
    
    // Store user details in cookies
    Cookies.set('user_id', userData._id, { expires: 1 }); // expires in 1 day
    Cookies.set('user_name', userData.name, { expires: 1 });
    Cookies.set('user_email', userData.email, { expires: 1 });
    Cookies.set('user_role', userData.role, { expires: 1 });

    // Store tokens in cookies
    Cookies.set('access_token', userData.access_token, { 
      expires: new Date(userData.tokenExpiresAt),
      secure: process.env.NODE_ENV === 'production', // only send over HTTPS in production
      sameSite: 'strict'
    });
    Cookies.set('refresh_token', userData.refresh_token, { 
      expires: new Date(userData.refreshExpiresAt),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    // Log user details separately
    console.group("User Details");
    console.log("User ID:", userData._id);
    console.log("Name:", userData.name);
    console.log("Email:", userData.email);
    console.log("Role:", userData.role);
    console.groupEnd();

    // Log tokens (avoid logging full tokens in production)
    console.group("Token Information");
    console.log("Access Token (first 20 chars):", userData.access_token.substring(0, 20) + "...");
    console.log("Refresh Token (first 20 chars):", userData.refresh_token.substring(0, 20) + "...");
    console.log("Refresh Expires At:", userData.refreshExpiresAt);
    console.groupEnd();

    console.groupEnd();

    // Optionally, you can also log to the network tab using console.table
    console.table({
      status: response.data.status,
      message: response.data.message,
      environment: response.data.environment,
      userId: userData._id,
      userName: userData.name,
      userEmail: userData.email,
      userRole: userData.role
    });

    return response.data;
  } catch (error) {
    console.group("Login API Error");
    console.error("Detailed Error:", error);
    console.groupEnd();

    // More specific error handling with proper type checking
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        throw new Error((axiosError.response.data as any)?.message || "Login failed");
      } else if (axiosError.request) {
        // The request was made but no response was received
        throw new Error("No response received from server");
      } else {
        // Something happened in setting up the request
        throw new Error("Error setting up login request");
      }
    }

    // Fallback error handling for non-axios errors
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
};