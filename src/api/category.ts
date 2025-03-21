// api/product.ts
import axios from "axios";
import { Category } from "../types/category.types";
import { mockCategoryData } from "../config/mock/categoryTable";

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T; // This should be generic to allow for different shapes of data
}

let currentController: AbortController;

export const getAllCategory = async (
  payload: any
): Promise<ApiResponse<Category[]>> => {
  // Return ApiResponse<User[]> type
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
      throw new Error("Failed to fetch users");
    }
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    }
    throw error;
  }
};

export const createCategory = async (
  payload: any
): Promise<ApiResponse<any>> => {
  console.log("Create Category payload:", payload); // Log the payload
  // Here you can add logic to make an API call if needed

  return {
    status: 200,
    message: "Category created successfully", // You can customize the message
    data: payload, // Return the payload or any other data needed
  };
};

// Get Category by ID function
export const getCategoryById = async (
  id: string
): Promise<ApiResponse<any>> => {
  console.log("Getting category with ID:", id);

  try {
    // In a real application, you would make an API call here
    // For now, we'll simulate by finding the category in mock data
    const category = mockCategoryData.find(
      (item) => item.id?.toString() === id || item._id === id
    );

    if (category) {
      return {
        status: 200,
        message: "Category found successfully",
        data: category,
      };
    } else {
      return {
        status: 404,
        message: "Category not found",
        data: null,
      };
    }
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

// Update Category function
export const updateCategory = async (
  id: string,
  payload: any
): Promise<ApiResponse<any>> => {
  console.log(`Updating category with ID: ${id}`, payload);

  try {
    // In a real application, you would make an API call here
    // For now, we'll simulate a successful update
    return {
      status: 200,
      message: "Category updated successfully",
      data: {
        id,
        ...payload,
        updatedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Create Subcategory function
export const createSubCategory = async (payload: {
  name: string;
  categoryId: string;
  image: string;
}): Promise<ApiResponse<any>> => {
  console.log("Create Subcategory payload:", payload); // Log the payload
  // Here you can add logic to make an API call if needed

  return {
    status: 200,
    message: "Subcategory created successfully", // You can customize the message
    data: payload, // Return the payload or any other data needed
  };
};
