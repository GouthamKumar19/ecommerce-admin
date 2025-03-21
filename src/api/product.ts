
import { Product } from "../types/product.types";
import { productMockData } from "../config/mock/productTable"; // Adjust the import path to where your mock data is located

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Get all products
export const getAllProducts = async (): Promise<ApiResponse<Product[]>> => {
  try {
    console.log("[API] Fetching all products");

    // Uncomment when API is ready
    // const response = await axiosInstance.post(
    //   'http://localhost:7004/v1/admin/products/getAll',
    //   {
    //     project: {
    //       _id: 1,
    //       name: 1,
    //       description: 1,
    //       price: 1,
    //       slashedPrice: 1,
    //       categoryId: 1,
    //       subCategoryId: 1,
    //       thumbnailImage: 1,
    //       images: 1,
    //       createdAt: 1,
    //       updatedAt: 1
    //     }
    //   },
    //   {
    //     headers: {
    //       'Authorization': 'Bearer 123',
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     }
    //   }
    // );
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
    console.error("[API] Error fetching products:", error);
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
    // const response = await axiosInstance.post(
    //   `http://localhost:7004/v1/admin/products/getOne/${id}`,
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
    //   },
    //   {
    //     headers: {
    //       'Authorization': 'Bearer 123',
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
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
