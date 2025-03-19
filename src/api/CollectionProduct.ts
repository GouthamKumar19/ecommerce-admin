import { Product } from "../types/product.types";
import { productMockData } from "../config/mock/productCollectionTable";

interface CollectionProductFormData {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: string;
  quantity: number;
  isFeatured: boolean;
  categoryId: string;
  subCategoryId: string;
  images: string[];
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

const logApiAction = (action: string, data?: any) => {
  console.log({
    timestamp: "2025-03-19 06:07:46",
    user: "suzzy-og",
    action,
    project: {
      collectionId: 1,
      productId: 1,
    },
    ...data,
  });
};

// Create a new collection product
export const createCollectionProduct = async (
  productData: CollectionProductFormData
): Promise<ApiResponse<Product>> => {
  try {
    logApiAction("CREATE_PRODUCT", { productData });

    // Mock response
    const mockResponse: ApiResponse<Product> = {
      status: 200,
      message: "Collection product created successfully",
      data: {
        id: String(productMockData.length + 1),
        _id: String(productMockData.length + 1),
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        status: productData.status,
        quantity: productData.quantity,
        isFeatured: productData.isFeatured,
        categoryId: productData.categoryId,
        subCategoryId: productData.subCategoryId,
        images: productData.images,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    logApiAction("CREATE_PRODUCT_SUCCESS", { response: mockResponse });
    return Promise.resolve(mockResponse);
  } catch (error) {
    logApiAction("CREATE_PRODUCT_ERROR", { error });
    throw error;
  }
};

// Update an existing collection product
export const updateCollectionProduct = async (
  productData: CollectionProductFormData
): Promise<ApiResponse<Product>> => {
  try {
    logApiAction("UPDATE_PRODUCT", { productData });

    // Mock response
    const mockResponse: ApiResponse<Product> = {
      status: 200,
      message: "Collection product updated successfully",
      data: {
        id: productData._id!,
        _id: productData._id!,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        status: productData.status,
        quantity: productData.quantity,
        isFeatured: productData.isFeatured,
        categoryId: productData.categoryId,
        subCategoryId: productData.subCategoryId,
        images: productData.images,
        updatedAt: new Date().toISOString(),
        createdAt: "2023-07-15T08:00:00Z",
      },
    };

    logApiAction("UPDATE_PRODUCT_SUCCESS", { response: mockResponse });
    return Promise.resolve(mockResponse);
  } catch (error) {
    logApiAction("UPDATE_PRODUCT_ERROR", { error });
    throw error;
  }
};

// Get a collection product by ID
export const getCollectionProductById = async (
  id: string
): Promise<ApiResponse<Product>> => {
  try {
    logApiAction("GET_PRODUCT_BY_ID", { productId: id });

    // Mock response using product data
    const product = productMockData.find((p) => p.id === id || p._id === id);

    if (!product) {
      logApiAction("GET_PRODUCT_BY_ID_ERROR", { error: "Product not found" });
      throw new Error("Collection product not found");
    }

    const mockResponse: ApiResponse<Product> = {
      status: 200,
      message: "Collection product fetched successfully",
      data: product,
    };

    logApiAction("GET_PRODUCT_BY_ID_SUCCESS", { response: mockResponse });
    return Promise.resolve(mockResponse);
  } catch (error) {
    logApiAction("GET_PRODUCT_BY_ID_ERROR", { error });
    throw error;
  }
};

// Get all collection products
export const getAllCollectionProducts = async (): Promise<
  ApiResponse<Product[]>
> => {
  try {
    logApiAction("GET_ALL_PRODUCTS");

    // Mock response using product data
    const mockResponse: ApiResponse<Product[]> = {
      status: 200,
      message: "Collection products fetched successfully",
      data: productMockData,
    };

    logApiAction("GET_ALL_PRODUCTS_SUCCESS", {
      count: productMockData.length,
      response: mockResponse,
    });
    return Promise.resolve(mockResponse);
  } catch (error) {
    logApiAction("GET_ALL_PRODUCTS_ERROR", { error });
    throw error;
  }
};

// Delete a collection product
export const deleteCollectionProduct = async (
  id: string
): Promise<ApiResponse<void>> => {
  try {
    logApiAction("DELETE_PRODUCT", { productId: id });

    // Mock response
    const mockResponse: ApiResponse<void> = {
      status: 200,
      message: "Collection product deleted successfully",
      data: undefined,
    };

    logApiAction("DELETE_PRODUCT_SUCCESS", { response: mockResponse });
    return Promise.resolve(mockResponse);
  } catch (error) {
    logApiAction("DELETE_PRODUCT_ERROR", { error });
    throw error;
  }
};

// Toggle product status (enable/disable)
export const toggleProductStatus = async (
  id: string,
  enable: boolean
): Promise<ApiResponse<void>> => {
  try {
    logApiAction("TOGGLE_PRODUCT_STATUS", {
      productId: id,
      action: enable ? "ENABLE" : "DISABLE",
    });

    // Mock response
    const mockResponse: ApiResponse<void> = {
      status: 200,
      message: `Collection product ${enable ? "enabled" : "disabled"} successfully`,
      data: undefined,
    };

    logApiAction("TOGGLE_PRODUCT_STATUS_SUCCESS", { response: mockResponse });
    return Promise.resolve(mockResponse);
  } catch (error) {
    logApiAction("TOGGLE_PRODUCT_STATUS_ERROR", { error });
    throw error;
  }
};
