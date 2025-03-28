
import { Product, ProductResponse } from "../types/product.types";
import { productMockData } from "../config/mock/productTable"; // Adjust the import path to where your mock data is located
import axiosInstance from "./axios";
interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}


// Get all products
export const getAllProducts = async (): Promise<ApiResponse<ProductResponse>> => {
  try {
    console.log("[API] Fetching all products");

    const response = await axiosInstance.post('/admin/products/getAll')//, {
      // project: {
      //   _id: 1,
      //   name: 1,
      //   description: 1,
      //   price: 1,
      //   slashedPrice: 1,
      //   categoryId: 1,
      //   subCategoryId: 1,
      //   thumbnailImage: 1,
      //   images: 1,
      //   quantity: 1,
      //   isFeatured: 1,
      //   createdAt: 1,
      //   updatedAt: 1
      // }
    //});

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

    // Uncomment when API is ready
    // const response = await axiosInstance.post(
    //   `/admin/products/getOne/${id}`,
    //   {
    //     projection: {
    //       name: 1,
    //       description: 1,
    //       price: 1,
    //       slashedPrice: 1,
    //       categoryId: 1,
    //       subCategoryId: 1,
    //       images: 1,
    //       thumbnailImage: 1,
    //       createdAt: 1,
    //       updatedAt: 1
    //     }
    //   }
    // );
    // return response.data;

    // Mock response using productMockData
    const product = productMockData.find((p) => p._id === id);

    if (!product) {
      throw new Error("Product not found");
    }

    const mockResponse: ApiResponse<Product> = {
      status: 200,
      message: "Success",
      data: product,
    };

    console.log("[API] Mock get response:", mockResponse);
    return Promise.resolve(mockResponse);
  } catch (error) {
    console.error("[API] Error fetching product:", error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (
  id: string,
  productData: Partial<Product>
): Promise<ApiResponse<string>> => {
  try {
    console.log(
      "[API] Updating product with ID:",
      id,
      "and data:",
      productData
    );

    // Uncomment when API is ready
    // const response = await axiosInstance.put(
    //   `/admin/products/${id}`,
    //   productData
    // );
    // return response.data;

    // Mock response
    const mockResponse: ApiResponse<string> = {
      status: 200,
      message: "Success",
      data: "Product updated successfully",
    };

    console.log("[API] Mock update response:", mockResponse);
    return Promise.resolve(mockResponse);
  } catch (error) {
    console.error("[API] Error updating product:", error);
    throw error;
  }
};

// Add a product
export const addProduct = async (
  productData: Omit<Product, "_id">
): Promise<ApiResponse<{ _id: string }>> => {
  try {
    console.log("[API] Adding product with data:", productData);

    // Uncomment when API is ready
    // const response = await axiosInstance.post(
    //   '/admin/products/add',
    //   productData
    // );
    // return response.data;

    // Mock response
    const mockResponse: ApiResponse<{ _id: string }> = {
      status: 200,
      message: "Success",
      data: {
        _id: "65a7b8c9d4e5f6a7b8c9d4e5",
      },
    };

    console.log("[API] Mock add response:", mockResponse);
    return Promise.resolve(mockResponse);
  } catch (error) {
    console.error("[API] Error adding product:", error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (
  id: string
): Promise<ApiResponse<string>> => {
  try {
    console.log("[API] Deleting product with ID:", id);

    // Uncomment when API is ready
    // const response = await axiosInstance.post(
    //   `/admin/products/delete/${id}`
    // );
    // return response.data;

    // Mock response
    const mockResponse: ApiResponse<string> = {
      status: 200,
      message: "Success",
      data: "Product deleted successfully",
    };

    console.log("[API] Mock delete response:", mockResponse);
    return Promise.resolve(mockResponse);
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

