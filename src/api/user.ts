// api/product.ts
import axios from 'axios';
import { User } from '../types/users.types';
import { items } from '../config/mock/userTable'; // Adjust the import path to where your mock data is located
interface UserFormData {
  name: string;
  email: string;
  password: string;
  gender: string;
  phone:string;
  countryCode:string;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

let currentController: AbortController;

export const getAllUser = async (payload: any): Promise<ApiResponse<User[]>> => { // Return ApiResponse<User[]> type
  console.log("Payload received:", payload); // Log the payload for debugging
  
  try {
    if (currentController) {
      currentController.abort();
    }
    currentController = new AbortController();

    // Uncomment the following lines if you're using an actual API call:
    /*
    const response = await axiosInstance.post(
      '/admin/products/getAll',
      payload, // Sending the payload for sorting and pagination
      {
        signal: currentController.signal,
      }
    );
    */

    // Simulate API call with imported mock data
    const totalCount = items.length;
    const response = {
      status: 200,
      message: "Success",
      data: {
        totalCount, // Send the total count of users
        tableData: items, // Assuming items is an array of user data
      },
    };

    if (response?.status === 200) {
      return {
        status: response.status,
        message: response.message,
        data: response.data.tableData, // Return the array of users in the data
      };
    } else {
      throw new Error('Failed to fetch users');
    }
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    }
    throw error;
  }
};
export const createUser = async (
  UserData: UserFormData
): Promise<ApiResponse<User>> => {
  try {
    console.log("[API] Creating user with data:", UserData);

    // Uncomment when API is ready
    // const response = await axiosInstance.post('/admin/users/create', UserData);
    // return response.data;

    // Mock response
    const mockResponse: ApiResponse<User> = {
      status: 200,
      message: "User created successfully",
      data: {
        _id: "generated-id-123", // Mock ID; replace with a real ID generation logic when implementing
        name: UserData.name,
        email: UserData.email,
        password: UserData.password,
        gender: UserData.gender,
        phone: UserData.phone,
        isEnabled: true, // Default to true; adjust as necessary for your application
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    console.log("[API] Mock create response:", mockResponse);
    return Promise.resolve(mockResponse);
  } catch (error) {
    console.error("[API] Error creating user:", error);
    throw error;
  }
};

export const getUserById = async (
  id: string
): Promise<ApiResponse<User>> => {
  try {
    console.log("[API] Fetching user with ID:", id);

    // Uncomment when API is ready
    // const response = await axiosInstance.get(`/admin/users/getOne/${id}`);
    // return response.data;

    // Mock response using users data
    const user = items.find((u) => u.id === id || u._id === id);

    if (!user) {
      throw new Error("User not found");
    }

    const mockResponse: ApiResponse<User> = {
      status: 200,
      message: "Success",
      data: {
        _id: user._id || String(user.id),
        name: user.name,
        email: user.email,
        password: user.password,
        gender: user.gender,
        phone: user.phone,
        isEnabled: user.isEnabled,
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: user.updatedAt || new Date().toISOString(),
      },
    };

    console.log("[API] Mock get response:", mockResponse);
    return Promise.resolve(mockResponse);
  } catch (error) {
    console.error("[API] Error fetching user:", error);
    throw error;
  }
};
