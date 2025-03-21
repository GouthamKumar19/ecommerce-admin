import axios from 'axios';
import { Collection } from '../types/collections.types';
import { collectionMockData } from '../config/mock/collections'; // Adjust the import path to where your mock data is located

interface CollectionFormData {
  name: string;
  bannerImage: string;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

let currentController: AbortController;

export const getAllCollection = async (payload: any): Promise<ApiResponse<Collection[]>> => {
  console.log("Payload received:", payload); // Log the payload for debugging
  
  try {
    if (currentController) {
      currentController.abort();
    }
    currentController = new AbortController();

    // Simulate API call with imported mock data
    const totalCount = collectionMockData.length;
    const response = {
      status: 200,
      message: "Success",
      data: {
        totalCount, // Send the total count of collections
        tableData: collectionMockData, // Assuming items is an array of collection data
      },
    };

    if (response?.status === 200) {
      return {
        status: response.status,
        message: response.message,
        data: response.data.tableData, // Return the array of collections in the data
      };
    } else {
      throw new Error('Failed to fetch collections');
    }
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    }
    throw error;
  }
};

export const createCollection = async (
  collectionData: CollectionFormData
): Promise<ApiResponse<Collection>> => {
  try {
    console.log("[API] Creating collection with data:", collectionData);

    // Mock response
    const mockResponse: ApiResponse<Collection> = {
      status: 200,
      message: "Collection created successfully",
      data: {
        _id: "generated-id-" + Date.now(), // Mock ID with timestamp
        name: collectionData.name,
        bannerImage: collectionData.bannerImage,
        isEnabled: true, // Default to true
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    console.log("[API] Mock create response:", mockResponse);
    return Promise.resolve(mockResponse);
  } catch (error) {
    console.error("[API] Error creating collection:", error);
    throw error;
  }
};

export const getCollectionById = async (
  id: string
): Promise<ApiResponse<Collection>> => {
  try {
    console.log("[API] Fetching collection with ID:", id);

    // Mock response using collection data
    const collection = collectionMockData.find((c) => c._id === id || c.id === id);

    if (!collection) {
      throw new Error("Collection not found");
    }

    const mockResponse: ApiResponse<Collection> = {
      status: 200,
      message: "Success",
      data: {
        _id: collection._id || String(collection.id),
        name: collection.name,
        bannerImage: collection.bannerImage,
        isEnabled: collection.isEnabled,
        createdAt: collection.createdAt || new Date().toISOString(),
        updatedAt: collection.updatedAt || new Date().toISOString(),
      },
    };

    console.log("[API] Mock get response:", mockResponse);
    return Promise.resolve(mockResponse);
  } catch (error) {
    console.error("[API] Error fetching collection:", error);
    throw error;
  }
};

export const updateCollection = async (
  id: string,
  collectionData: CollectionFormData
): Promise<ApiResponse<Collection>> => {
  try {
    console.log("[API] Updating collection with ID:", id, "and data:", collectionData);

    // Mock response
    const mockResponse: ApiResponse<Collection> = {
      status: 200,
      message: "Collection updated successfully",
      data: {
        _id: id,
        name: collectionData.name,
        bannerImage: collectionData.bannerImage,
        isEnabled: true, // Assuming we keep this as is
        createdAt: new Date().toISOString(), // In a real implementation, you'd keep the original creation date
        updatedAt: new Date().toISOString(),
      },
    };

    console.log("[API] Mock update response:", mockResponse);
    return Promise.resolve(mockResponse);
  } catch (error) {
    console.error("[API] Error updating collection:", error);
    throw error;
  }
};
export const deleteCollection = async (
  id: string
): Promise<ApiResponse<{ id: string }>> => {
  try {
    console.log("[API] Deleting collection with ID:", id);

    // First check if the collection exists
    const collection = collectionMockData.find((c) => c._id === id || c.id === id);
    
    if (!collection) {
      throw new Error("Collection not found");
    }

    // Mock response for successful deletion
    const mockResponse: ApiResponse<{ id: string }> = {
      status: 200,
      message: "Collection deleted successfully",
      data: {
        id: id, // Return the ID of the deleted collection
      },
    };

    console.log("[API] Mock delete response:", mockResponse);
    return Promise.resolve(mockResponse);
  } catch (error) {
    console.error("[API] Error deleting collection:", error);
    throw error;
  }
};