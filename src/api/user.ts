// api/product.ts
import axios from 'axios';
import { User } from '../types/users.types';
import { items } from '../config/mock/userTable'; // Adjust the import path to where your mock data is located

let currentController: AbortController;

export const getAllProducts = async (payload: any): Promise<User[]> => { // Accept the payload parameter
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
    const response = {
      status: 200,
      data: {
        totalCount: items.length, // Use the length of your mock data
        tableData: items, // Assuming productMockData is an array of products
      },
    };

    if (response?.status === 200) {
      return response?.data?.tableData;
    } else {
      throw new Error('Failed to fetch products');
    }
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    }
    throw error;
  }
};