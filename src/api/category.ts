
import {  CategoryResponse } from "../types/category.types";
import { mockCategoryData } from "../config/mock/categoryTable";
import { SortConfig } from "../types/category.types";
import axiosInstance from "./axios";

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



export const createCategory = async (
  payload: any
): Promise<ApiResponse<any>> => {
  console.log("Create Category payload:", payload);

  return {
    status: 200,
    message: "Category created successfully",
    data: payload,
  };
};

export const getCategoryById = async (
  id: string
): Promise<ApiResponse<any>> => {
  console.log("Getting category with ID:", id);

  try {
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

export const updateCategory = async (
  id: string,
  payload: any
): Promise<ApiResponse<any>> => {
  console.log(`Updating category with ID: ${id}`, payload);

  try {
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

export const createSubCategory = async (payload: {
  name: string;
  categoryId: string;
  image: string;
}): Promise<ApiResponse<any>> => {
  console.log("Create Subcategory payload:", payload);

  return {
    status: 200,
    message: "Subcategory created successfully",
    data: payload,
  };
};
