import axios from "axios";
import { User } from "../types/users.types";
import axiosInstance from "./axios";
import { SortConfig } from "../types/users.types";

let currentController: AbortController | null = null;

interface UserResponse {
  tableData: User[];
  // Add other response properties as needed
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Get all users with pagination, search, and sort
export const getAllUser = async (
  page: number,
  itemsPerPage: number,
  searchTerm: string,
  sortConfig: SortConfig
): Promise<ApiResponse<UserResponse>> => {
  try {
    if (currentController) {
      currentController.abort();
    }
    currentController = new AbortController();

    const response = await axiosInstance.post(
      "/admin/users/getAll",
      {
        page,
        itemsPerPage,
        search: [
          {
            term: searchTerm,
            fields: ["name", "email"],
            startsWith: true,
            endsWith: false,
          },
        ],
        options: {
          sortBy: [sortConfig.key],
          sortDesc: [sortConfig.direction === "descending"],
        },
      },
      {
        signal: currentController.signal,
      }
    );

    if (response?.status === 200) {
      return {
        status: response.status,
        message: response.data.message || "Success",
        data: response.data.data || { tableData: [] },
      };
    } else {
      throw new Error("Failed to fetch users");
    }
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    }
    throw error;
  } finally {
    currentController = null;
  }
};

// Interface for user form data
export interface UserFormData {
  name: string;
  email: string;
  password?: string; // Made optional for updates
  gender: string;
  phone: string;
  countryCode: string;
  addresses?: any[]; // Added to support addresses
}

// Function to create a new user
export const createUser = async (
  userData: UserFormData
): Promise<ApiResponse<User>> => {
  try {
    const response = await axiosInstance.post("/admin/users/create", userData);

    if (response?.status === 200 || response?.status === 201) {
      return {
        status: response.status,
        message: response.data.message || "User created successfully",
        data: response.data.data,
      };
    } else {
      throw new Error("Failed to create user");
    }
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to create user");
    }
    throw error;
  }
};

// Function to update an existing user
export const updateUser = async (
  userId: string,
  userData: Partial<UserFormData>
): Promise<ApiResponse<User>> => {
  try {
    // Using the correct endpoint format based on your API structure
    const response = await axiosInstance.put(
      `/admin/users/update/${userId}`,
      userData
    );

    if (response?.status === 200) {
      return {
        status: response.status,
        message: response.data.message || "User updated successfully",
        data: response.data.data,
      };
    } else {
      throw new Error("Failed to update user");
    }
  } catch (error: any) {
    console.error("Update user error:", error);
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to update user");
    }
    throw error;
  }
};

// Function to get a single user by ID
export const getUserById = async (
  userId: string
): Promise<ApiResponse<User>> => {
  try {
    // Fixed API endpoint with proper parameter format
    const response = await axiosInstance.post(`/admin/users/getOne/${userId}`);
    return response.data;
  } catch (error) {
    console.error("[API] Error fetching user:", error);
    throw error;
  }
};
