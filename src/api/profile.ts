import { ApiResponse, UserProfile } from "../types/profileTypes";
import axiosInstance from "./axios";
import Cookies from "js-cookie";

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

// Updated function to update only the name in user profile
export const updateProfile = async (
  token: string, 
  name: string, 
  currentProfileData: UserProfile
): Promise<ApiResponse<UserProfile>> => {
  console.log("[API] Updating profile name:", name);

  // Create an updated profile object, keeping other fields from current profile
  const updatedProfileData = {
    ...currentProfileData,
    name: name,
    updatedAt: new Date().toISOString()
  };

  const response = await axiosInstance.put(
    "/admin/auth/update",
    updatedProfileData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const updatedData = response.data;

  // Update name in cookies
  Cookies.set("name", updatedData.name);

  return response.data;
};