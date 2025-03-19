
import { ApiResponse, UserProfile } from "../types/profileTypes";
import {
  mockApiResponse,
  mockUpdateApiResponse,
} from "../config/mock/mockProfiles"; // Import the mock data

// Function to get user profile information
export const getProfile = async (
  token: string
): Promise<ApiResponse<UserProfile>> => {
  try {
    console.log("[API] Fetching user profile with token:", token);

    // Uncomment when API is ready
    // const response = await axiosInstance.post(
    //   "/admin/auth/get",
    //   {},
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );
    // return response.data;

    // Mock response
    console.log("[API] Mock profile response:", mockApiResponse);
    return Promise.resolve(mockApiResponse);
  } catch (error) {
    console.error("[API] Error fetching profile:", error);
    throw error;
  }
};

// Function to update user profile information
export const updateProfile = async (
  _token: string,
  profileData: UserProfile
): Promise<ApiResponse<UserProfile>> => {
  try {
    console.log("[API] Updating profile with data:", profileData);

    // Uncomment when API is ready
    // const response = await axiosInstance.put(
    //   "/admin/auth/profile",
    //   profileData,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );
    // return response.data;

    // Mock response
    console.log("[API] Mock update profile response:", mockUpdateApiResponse);
    return Promise.resolve(mockUpdateApiResponse);
  } catch (error) {
    console.error("[API] Error updating profile:", error);
    throw error;
  }
};
