import { Product } from "../types/product.types";
import { productMockData } from "../config/mock/productCollectionTable";

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
    console.log("[API] Creating product with data:", productData); // Fixed: Changed productMockData to productData

    // Uncomment when API is ready
    // const response = await axiosInstance.post('/admin/products/create-update', productData);
    // return response.data;

    // Mock response
    const mockResponse: ApiResponse<Product> = {
      status: 200,
      message: "Product created successfully",
      data: {
        _id: String(productMockData.length + 1),
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Product, // Add type assertion here
    };

    console.log("[API] Mock create response:", mockResponse);
    return Promise.resolve(mockResponse);
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

    // Uncomment when API is ready
    // const response = await axiosInstance.post('/admin/products/create-update', productData);
    // return response.data;

    // Mock response
    const mockResponse: ApiResponse<Product> = {
      status: 200,
      message: "Product created successfully",
      data: {
        _id: String(productMockData.length + 1),
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Product, // Add type assertion here
    };

    console.log("[API] Mock update response:", mockResponse);
    return Promise.resolve(mockResponse);
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

    // Uncomment when API is ready
    // const response = await axiosInstance.get(`/admin/products/getOne/${id}`);
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

// Get all products
export const getAllProducts = async (): Promise<ApiResponse<Product[]>> => {
  try {
    console.log("[API] Fetching all products");

    // Add this line to log the mock products data
    console.log("[API] Mock products data:", productMockData);

    const mockResponse: ApiResponse<Product[]> = {
      status: 200,
      message: "Success",
      data: productMockData,
    };

    console.log("[API] Mock getAll response:", mockResponse);
    return Promise.resolve(mockResponse);
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

    // Uncomment when API is ready
    // const response = await axiosInstance.delete(`/admin/products/delete/${id}`);
    // return response.data;

    // Mock response
    const mockResponse: ApiResponse<{ deleted: boolean }> = {
      status: 200,
      message: "Product deleted successfully",
      data: { deleted: true },
    };

    console.log("[API] Mock delete response:", mockResponse);
    return Promise.resolve(mockResponse);
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

    // Uncomment when API is ready
    // const response = await axiosInstance.patch(`/admin/products/toggle-status/${id}`, { enabled });
    // return response.data;

    // Mock response
    const product = productMockData.find((p) => p._id === id);
    if (!product) {
      throw new Error("Product not found");
    }

    const mockResponse: ApiResponse<Product> = {
      status: 200,
      message: `Product ${enabled ? "enabled" : "disabled"} successfully`,
      data: {
        ...product,
        status: enabled ? "in-stock" : "disabled",
        updatedAt: new Date().toISOString(),
      },
    };

    console.log("[API] Mock toggle status response:", mockResponse);
    return Promise.resolve(mockResponse);
  } catch (error) {
    console.error("[API] Error toggling product status:", error);
    throw error;
  }
};
