// api/product.ts
import axios from 'axios';
import { Category } from '../types/category.types';
import { mockCategoryData } from '../config/mock/categoryTable';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T; // This should be generic to allow for different shapes of data
}

let currentController: AbortController;

export const getAllCategory = async (payload: any): Promise<ApiResponse<Category[]>> => { // Return ApiResponse<User[]> type
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
    const totalCount = mockCategoryData.length;
    const response = {
      status: 200,
      message: "Success",
      data: {
        totalCount, // Send the total count of users
        tableData: mockCategoryData, // Assuming items is an array of user data
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
export const createCategory = async (payload: any): Promise<ApiResponse<any>> => {
   console.log("Create Category payload:", payload); // Log the payload
   // Here you can add logic to make an API call if needed

   return {
       status: 200,
       message: "Category created successfully", // You can customize the message
       data: payload, // Return the payload or any other data needed
   };
};

// Create Subcategory function
export const createSubCategory = async (payload: { name: string; categoryId: string; image: string }): Promise<ApiResponse<any>> => {
   console.log("Create Subcategory payload:", payload); // Log the payload
   // Here you can add logic to make an API call if needed

   return {
       status: 200,
       message: "Subcategory created successfully", // You can customize the message
       data: payload, // Return the payload or any other data needed
   };
};