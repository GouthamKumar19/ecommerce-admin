import { Product,ProductResponse } from "../types/collectionProduct.types";

import axiosInstance from "./axios";

interface ProductFormData {
  _id?: string;
  name: string;
  description: string;
  price: number;
  slashedPrice?: number;
  quantity: number;
  isFeatured: boolean;
  categoryId: string;
  subCategoryId?: string;
  images: string[];
  thumbnailImage?: string;
  collectionId: string;
  productId: string;
  status: string;
  tags?: string[];
  rating?: number;
  specifications?: Record<string, any>;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Create a new product
export const createProduct = async (
  productData: ProductFormData
): Promise<ApiResponse<Product>> => {
  try {
    console.log("[API] Creating product with data:", productData);

    const response = await axiosInstance.post('/admin/products/create-update', productData);
    return response.data;

  } catch (error) {
    console.error("[API] Error creating product:", error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (
  productData: ProductFormData
): Promise<ApiResponse<Product>> => {
  try {
    console.log("[API] Updating product with data:", productData);

    const response = await axiosInstance.post('/admin/products/create-update', productData);
    return response.data;

  } catch (error) {
    console.error("[API] Error updating product:", error);
    throw error;
  }
};

// Get a product by ID
export const getProductById = async (
  id: string
): Promise<ApiResponse<Product>> => {
  try {
    console.log("[API] Fetching product with ID:", id);

    const response = await axiosInstance.get(`/admin/products/getOne/${id}`);
    return response.data;

  } catch (error) {
    console.error("[API] Error fetching product:", error);
    throw error;
  }
};

// Get all products
export const getAllProducts = async (): Promise<ApiResponse<ProductResponse>> => {
  try {
    console.log("[API] Fetching all products");

    const response = await axiosInstance.post("/admin/collectionProducts/getAll");

    return response.data;
  } catch (error) {
    console.error("[API] Error fetching all products:", error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (
  id: string
): Promise<ApiResponse<{ deleted: boolean }>> => {
  try {
    console.log("[API] Deleting product with ID:", id);

    const response = await axiosInstance.delete(`/admin/products/delete/${id}`);
    return response.data;

  } catch (error) {
    console.error("[API] Error deleting product:", error);
    throw error;
  }
};

// Toggle product status
export const toggleProductStatus = async (
  id: string,
  enabled: boolean
): Promise<ApiResponse<Product>> => {
  try {
    console.log("[API] Toggling product status:", { id, enabled });

    const response = await axiosInstance.patch(`/admin/products/toggle-status/${id}`, { enabled });
    return response.data;

  } catch (error) {
    console.error("[API] Error toggling product status:", error);
    throw error;
  }
};