
import { Product } from "../types/product.types";
import { productMockData } from "../config/mock/productTable";

interface ProductFormData {
  _id?: string;
  name: string;
  description: string;
  price: number;
  slashedPrice: number;
  categoryId: string;
  subCategoryId: string;
  images: string[];
  thumbnailImage?: string;
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

    // Uncomment when API is ready
    // const response = await axiosInstance.post('/admin/products/add', productData);
    // return response.data;

    // Mock response
    const mockResponse: ApiResponse<Product> = {
      status: 200,
      message: "Product created successfully",
      data: {
        id: String(productMockData.length + 1),
        _id: String(productMockData.length + 1),
        name: productData.name,
        description: productData.description,
        price: productData.price,
        slashedPrice: productData.slashedPrice,
        categoryId: productData.categoryId,
        subCategoryId: productData.subCategoryId,
        images: productData.images,
        thumbnailImage: productData.thumbnailImage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
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
    // const response = await axiosInstance.post('/admin/products/update', productData);
    // return response.data;

    // Mock response
    const mockResponse: ApiResponse<Product> = {
      status: 200,
      message: "Product updated successfully",
      data: {
        id: productData._id!,
        _id: productData._id!,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        slashedPrice: productData.slashedPrice,
        categoryId: productData.categoryId,
        subCategoryId: productData.subCategoryId,
        images: productData.images,
        thumbnailImage: productData.thumbnailImage,
        updatedAt: new Date().toISOString(),
        createdAt: "2023-07-15T08:00:00Z", // Mock original creation date
      },
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

    // Mock response using products data
    const product = productMockData.find((p) => p.id === id || p._id === id);

    if (!product) {
      throw new Error("Product not found");
    }

    const mockResponse: ApiResponse<Product> = {
      status: 200,
      message: "Success",
      data: {
        id: product.id,
        _id: product._id || String(product.id),
        name: product.name,
        description: product.description,
        price: product.price,
        slashedPrice: product.slashedPrice,
        categoryId: product.categoryId,
        subCategoryId: product.subCategoryId,
        images: product.images,
        thumbnailImage: product.thumbnailImage,
        createdAt: product.createdAt || "2023-07-15T08:00:00Z",
        updatedAt: product.updatedAt || "2023-07-15T08:00:00Z",
      },
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

    // Uncomment when API is ready
    // const response = await axiosInstance.get('/admin/products/getAll');
    // return response.data;

    // Mock response
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

// Delete a product by ID
export const deleteProduct = async (
  id: string
): Promise<ApiResponse<string>> => {
  try {
    console.log("[API] Deleting product with ID:", id);

    // Uncomment when API is ready
    // const response = await axiosInstance.post(`/admin/products/delete/${id}`, {});
    // return response.data;

    // Mock response
    const mockResponse: ApiResponse<string> = {
      status: 200,
      message: "Product deleted successfully",
      data: id,
    };

    console.log("[API] Mock delete response:", mockResponse);
    return Promise.resolve(mockResponse);
  } catch (error) {
    console.error("[API] Error deleting product:", error);
    throw error;
  }
};
