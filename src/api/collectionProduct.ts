import { Product } from "../types/collectionProduct.types";
import axiosInstance from "./axios";

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Delete a product
export const deleteProduct = async (
  ids: string[]
): Promise<ApiResponse<{ deleted: boolean }>> => {
  try {
    console.log("[API] Deleting products with IDs:", ids);

    const response = await axiosInstance.post(
      `/admin/collectionProducts/delete`,
      {
        ids, // Sending body in DELETE request
      }
    );

    return response.data.id;
  } catch (error) {
    console.error("[API] Error deleting products:", error);
    throw error;
  }
};

// Toggle product status
export const toggleProductStatus = async (
  id: string,
  isEnabled: boolean
): Promise<ApiResponse<{ updatedProductId: string }>> => {
  try {
    console.log("[API] Toggling product status:", { id, isEnabled });

    const response = await axiosInstance.put(
      `/admin/collectionProducts/update/${id}`,
      { isEnabled }
    );
    return response.data;
  } catch (error) {
    console.error("[API] Error toggling product status:", error);
    throw error;
  }
};

// Add many products to a collection
export const addProductsToCollection = async (
  payload: { collectionId: string; productId: string }[]
): Promise<ApiResponse<{ success: boolean }>> => {
  try {
    console.log("[API] Adding products to collection with payload:", payload);
    const response = await axiosInstance.post(
      "/admin/collectionProducts/addMany",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("[API] Error adding products to collection:", error);
    throw error;
  }
};

// Get products by collection ID
export const getProductsByCollectionId = async (
  collectionId: string
): Promise<ApiResponse<{ products: Product[] }>> => {
  try {
    console.log("[API] Fetching products by collection ID:", collectionId);

    const response = await axiosInstance.get(
      `/admin/collectionProducts/getByCollection/${collectionId}`
    );
    return response.data;
  } catch (error) {
    console.error("[API] Error fetching products by collection ID:", error);
    throw error;
  }
};

export const updateProductsInCollection = async (payload: {
  ids: string[];
  isEnabled: boolean;
}): Promise<ApiResponse<{ success: boolean }>> => {
  try {
    console.log("[API] Updating products in collection with payload:", payload);
    const response = await axiosInstance.put(
      "/admin/collectionProducts/updateMany",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("[API] Error updating products in collection:", error);
    throw error;
  }
};