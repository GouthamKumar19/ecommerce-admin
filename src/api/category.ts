import { CategoryResponse } from "../types/category.types";
import { SortConfig } from "../types/category.types";
import axiosInstance from "./axios";
import axios from "axios";

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

let currentController: AbortController | null = null;

export const getAllCategory = async (
  page: number,
  itemsPerPage: number,
  searchTerm: string,
  sortConfig: SortConfig
): Promise<ApiResponse<CategoryResponse>> => {
  try {
    if (currentController) {
      currentController.abort();
    }
    currentController = new AbortController();
    console.log("[API] Fetching all testimonials");

    const response = await axiosInstance.post(
      "/admin/categories/getAll",
      {
        page,
        itemsPerPage,
        search: [
          {
            term: searchTerm,
            fields: ["name"],
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
    return response.data;
  } catch (error) {
    console.error("[API] Error fetching all categories:", error);
    throw error;
  }
};

export const createCategory = async (payload: {
  name: string;
  image: string;
}): Promise<ApiResponse<{ id: string }>> => {
  console.log("Create Category payload:", payload);

  try {
    const response = await axiosInstance.post(
      "/admin/categories/create",
      payload
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating category:", error.response?.data);
      throw new Error(
        error.response?.data.message || "Error creating category"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("Unexpected error creating category");
    }
  }
};

export const getCategoryById = async (
  id: string
): Promise<ApiResponse<any>> => {
  console.log("Getting category with ID:", id);

  try {
    const response = await axiosInstance.post(`/admin/categories/getOne/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

export const updateCategory = async (
  id: string,
  payload: any
): Promise<ApiResponse<any>> => {
  console.log(`Updating category with ID: ${id}`, payload);

  try {
    const response = await axiosInstance.post(`/admin/categories/create`, {
      ...payload,
      id,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating category:", error.response?.data);
      throw new Error(
        error.response?.data.message || "Error updating category"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("Unexpected error updating category");
    }
  }
};
// Modified createSubCategory function
export const createSubCategory = async (
  payload: {
    name: string;
    categoryId: string;
    image: string;
  }[]
): Promise<ApiResponse<{ id: string }>> => {
  console.log("Create Subcategory payload:", payload);
  

  console.log("Formatted Subcategory payload:", payload);

  try {
    const response = await axiosInstance.post(
      "/admin/subcategories/addMany",
      payload
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating subcategory:", error.response?.data);
      throw new Error(
        error.response?.data.message || "Error creating subcategory"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("Unexpected error creating subcategory");
    }
  }
};
export const updateSubcategories = async (
  payload: any
): Promise<ApiResponse<any>> => {
  console.log(`Updating subcategories with payload:`, payload);

  try {
    const response = await axiosInstance.put(
      `/admin/subcategories/update`, // Confirm this endpoint is correct.
      payload
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating subcategories:", error.response?.data);
      throw new Error(
        error.response?.data.message || "Error updating subcategories"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("Unexpected error updating subcategories");
    }
  }
};

export const deleteCategoryById = async (
  id: string
): Promise<ApiResponse<any>> => {
  console.log("Deleting category with ID:", id);

  try {
    const response = await axiosInstance.delete(
      `/admin/categories/delete/${id}`
    );

    if (response.status === 200) {
      return {
        status: 200,
        message: "Category deleted successfully",
        data: response.data,
      };
    } else {
      return {
        status: response.status,
        message: "Error deleting category",
        data: null,
      };
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
export const deleteSubcategories = async (
  subcategoryIds: string[]
): Promise<ApiResponse<any>> => {
  console.log("Deleting subcategories with IDs:", subcategoryIds);

  try {
    const response = await axiosInstance.post(
      "/admin/subcategories/deleteMany",
      { ids: subcategoryIds }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting subcategories:", error.response?.data);
      throw new Error(
        error.response?.data.message || "Error deleting subcategories"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("Unexpected error deleting subcategories");
    }
  }
};
