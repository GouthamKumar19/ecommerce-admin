// api/product.ts
import axios from 'axios';
import { Enquiry } from '../types/enquiry.types';
import { enquiries } from '../config/mock/enquiriesTable';

let currentController: AbortController;

export const getAllEnquiry = async (payload: any): Promise<Enquiry[]> => { // Accept the payload parameter
  console.log("Payload received:", payload); // Log the payload for debugging
  
  try {
    if (currentController) {
      currentController.abort();
    }
    currentController = new AbortController();

    // Uncomment the following lines if you're using an actual API call:
    /*
    const response = await axiosInstance.post(
      '/admin/enquiries/getAll',
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
        totalCount: enquiries.length, // Use the length of your mock data
        tableData: enquiries, // Assuming productMockData is an array of products
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