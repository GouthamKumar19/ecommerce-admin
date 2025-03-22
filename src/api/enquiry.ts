// api/product.ts
import axios from 'axios';
import { Enquiry } from '../types/enquiry.types';
import { enquiries } from '../config/mock/enquiriesTable';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
let currentController: AbortController;

export const getAllEnquiry = async (payload: any): Promise<ApiResponse<Enquiry[]>> => {
  console.log("Payload received:", payload); // Log the payload for debugging
  
  try {
    if (currentController) {
      currentController.abort();
    }
    currentController = new AbortController();

    
    // Simulate API call with imported mock data
    const totalCount = enquiries.length;
    const response = {
      status: 200,
      message: "Success",
      data: {
        totalCount, // Send the total count of collections
        tableData: enquiries, // Assuming items is an array of collection data
      },
    };

    if (response?.status === 200) {
      return {
        status: response.status,
        message: response.message,
        data: response.data.tableData, // Return the array of collections in the data
      };
    } else {
      throw new Error('Failed to fetch collections');
    }
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    }
    throw error;
  }
};