import { Product, ProductResponse } from "../types/product.types";
import axiosInstance from "./axios";
import axios from "axios";
import { SortConfig } from "../types/product.types";


interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}


const DEFAULT_CATEGORY_ID = "67ce9292891e6b7ec5df5831";
const DEFAULT_SUBCATEGORY_ID = "67cc21365983b789b129c1f6";

// To hold the current AbortController instance
let currentController: AbortController | null = null;

// Get all products
export const getAllProducts = async (
  page: number,
  itemsPerPage: number,
  searchTerm: string,
  sortConfig: SortConfig
): Promise<ApiResponse<ProductResponse>> => {
  try {
    if (currentController) {
      currentController.abort();
    }
    currentController = new AbortController();
    console.log("[API] Fetching all products");

    const response = await axiosInstance.post(
      "/admin/products/getAll",
      {
       
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
          page,
          itemsPerPage,
        },
      },
      {
        signal: currentController.signal,
      }
    );

    console.log("[API] getAll response:", response.data);
    return response.data;
  } catch (error) {
    console.error("[API] Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (
  id: string
): Promise<ApiResponse<Product>> => {
  try {
    console.log("[API] Fetching product with ID:", id);

    const response = await axiosInstance.post(`/admin/products/getOne/${id}`);
    return response.data;
  } catch (error) {
    console.error("[API] Error fetching product:", error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (
  id: string,
  productData: Partial<Product>
): Promise<ApiResponse<Product>> => {
  try {
    console.log(
      "[API] Updating product with ID:",
      id,
      "and data:",
      productData
    );

    // Prepare the update payload
    const updatePayload = {
      ...productData,
      // Ensure these fields are processed correctly
      price: productData.price ? Number(productData.price) : undefined,
      slashedPrice: productData.slashedPrice
        ? Number(productData.slashedPrice)
        : undefined,
      updatedAt: new Date().toISOString(),
    };

    // Make the API call to update the product
    const response = await axiosInstance.put(
      `/admin/products/${id}`,
      updatePayload
    );

    console.log("[API] Update product response:", response.data);
    return response.data;
  } catch (error) {
    console.error("[API] Error updating product:", error);

    throw error;
  }
};

// Add a product
export const addProduct = async (
  productData: Product
): Promise<ApiResponse<{ _id: string }>> => {
  try {
    console.log("[API] Adding product with data:", productData);

    // Create a clean object with only the fields the API expects
    const dataToSend = {
      name: productData.name,
      description: productData.description,
      price: Number(productData.price) || 0,
      slashedPrice: Number(productData.slashedPrice) || 0,
      categoryId: productData.categoryId || DEFAULT_CATEGORY_ID,
      subCategoryId: productData.subCategoryId || DEFAULT_SUBCATEGORY_ID,
      isFeatured: Boolean(productData.isFeatured),
      images: productData.images,
      thumbnailImage: productData.thumbnailImage,
      quantity: productData.quantity,
      createdAt: productData.createdAt,
      updatedAt: productData.updatedAt,
    };


    // Log exactly what we're sending to the server
    console.log("[API] Formatted data being sent:", JSON.stringify(dataToSend));

    const response = await axiosInstance.post(
      "/admin/products/add",
      dataToSend
    );

    // Log the full response for debugging
    console.log("[API] Complete response:", response);
    return response.data;
  } catch (error) {
    console.error("[API] Error adding product:", error);

    // Enhanced error logging
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);
    }

    throw error;
  }
};

// Delete a product
export const deleteProduct = async (
  id: string
): Promise<ApiResponse<string>> => {
  try {
    console.log("[API] Deleting product with ID:", id);

    // Using the real API endpoint
    const response = await axiosInstance.post(`/admin/products/delete/${id}`);

    console.log("[API] Delete response:", response.data);
    return response.data;
  } catch (error) {
    console.error("[API] Error deleting product:", error);
    throw error;
  }
};

// Add multiple product variants
export const addProductVariants = async (
  variants: { productId: string; name: string; value: string }[]
): Promise<ApiResponse<{ _id: string }[]>> => {
  try {
    console.log("[API] Adding product variants with data:", variants);
    
    const response = await axiosInstance.post(
      "/admin/productVariants/add",
      variants
    );
    return response.data;
  } catch (error) {
    console.error("[API] Error adding product variants:", error);
    throw error;
  }
};

export const updateProductVariants = async (
  variants: { _id: string; name: string; value: string }[]
): Promise<ApiResponse<any>> => {
  try {
    console.log("[API] Updating product variants with data:", variants);
    
    const response = await axiosInstance.put(
      "/admin/productVariants/update",
      variants
    );
    
    console.log("[API] Update variants response:", response.data);
    return response.data;
  } catch (error) {
    console.error("[API] Error updating product variants:", error);
    throw error;
  }
};


export const getProductVariantById = async (
  productId: string
): Promise<ApiResponse<any>> => {
  try {
    console.log("[API] Fetching variants for product ID:", productId);
    
    const response = await axiosInstance.post(`/admin/productVariants/getOne/${productId}`, {
      productId: productId
    });
    
    console.log("[API] Product variants response:", response.data);
    return response.data;
  } catch (error) {
    console.error("[API] Error fetching product variants:", error);
    throw error;
  }
};