// api/product.ts
import axios from 'axios';
import { Collection } from '../types/collections.types';
import { collectionMockData } from '../config/mock/collections'; // Adjust the import path to where your mock data is located
interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
let currentController: AbortController;

export const getAllCollection = async (payload: any): Promise<ApiResponse<Collection[]>> => { // Return ApiResponse<User[]> type
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
    const totalCount =collectionMockData.length;
    const response = {
      status: 200,
      message: "Success",
      data: {
        totalCount, // Send the total count of users
        tableData: collectionMockData, // Assuming items is an array of user data
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

