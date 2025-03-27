import { ApiResponse, UserProfile } from "../types/profileTypes";
import axiosInstance from "./axios"; // Make sure to import axios instance
import Cookies from "js-cookie"; // Import js-cookie

// Function to get user profile information
export const getProfile = async (
  token: string
): Promise<ApiResponse<UserProfile>> => {
  try {
    console.log("[API] Fetching user profile with token:", token);

    const response = await axiosInstance.post(
      "/admin/auth/get",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const profileData = response.data;

    // Store profile data in cookies
    Cookies.set("name", profileData.name);
    Cookies.set("email", profileData.email);

    return response.data;
  } catch (error) {
    console.error("[API] Error fetching profile:", error);
    throw error;
  }
};

// Function to update user profile information
export const updateProfile = async (
  token: string,
  profileData: UserProfile
): Promise<ApiResponse<UserProfile>> => {
    console.log("[API] Updating profile with data:", profileData);

    const response = await axiosInstance.put(
      "/admin/auth/",
      profileData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const updatedData = response.data;

    // Update cookies with the new profile data
    Cookies.set("name", updatedData.name);
    Cookies.set("email", updatedData.email);

    return response.data;
 
};