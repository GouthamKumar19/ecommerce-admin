import { Product, ProductResponse } from "../types/collectionProduct.types";
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
    
    const response = await axiosInstance.get(`/admin/collectionProducts/getOne/${id}`);
    return response.data;
   } catch (error) {
    console.error("[API] Error fetching product:", error);
    throw error;
  }
};

// Get all products
export const getAllProducts = async (
  page?: number,
  itemsPerPage?: number,
  searchValue?: string,
  sortConfig?: { key: string; direction: string }
): Promise<ApiResponse<ProductResponse>> => {
  try {
    console.log("[API] Fetching all products");
    
    const payload = {
      page,
      itemsPerPage,
      searchValue,
      sortConfig
    };
    
    const response = await axiosInstance.post("/admin/collectionProducts/getAll", payload);
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

// Add many products to a collection
export const addProductsToCollection = async (
  payload: { collectionId: string; productId: string }[]
): Promise<ApiResponse<{ success: boolean }>> => {
  try {
    console.log("[API] Adding products to collection with payload:", payload);
    const response = await axiosInstance.post('/admin/collectionProducts/addMany', payload);
    return response.data;
  } catch (error) {
    console.error("[API] Error adding products to collection:", error);
    throw error;
  }
};

// Get collection by ID with associated products
export const getCollectionById = async (
  id: string
): Promise<ApiResponse<{ collection: any; products: Product[] }>> => {
  try {
    console.log("[API] Fetching collection with ID:", id);
    
    const response = await axiosInstance.get(`/admin/collections/getOne/${id}`);
    return response.data;
  } catch (error) {
    console.error("[API] Error fetching collection:", error);
    throw error;
  }
};

// Get products by collection ID
export const getProductsByCollectionId = async (
  collectionId: string
): Promise<ApiResponse<{ products: Product[] }>> => {
  try {
    console.log("[API] Fetching products by collection ID:", collectionId);
    
    const response = await axiosInstance.get(`/admin/collectionProducts/getByCollection/${collectionId}`);
    return response.data;
  } catch (error) {
    console.error("[API] Error fetching products by collection ID:", error);
    throw error;
  }
};