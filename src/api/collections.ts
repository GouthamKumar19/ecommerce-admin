import axios from 'axios';
import { Collection, CollectionResponse } from '../types/collections.types';
import { collectionMockData } from '../config/mock/collections';
import axiosInstance from './axios';
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

export const getAllCollection = async (): Promise<ApiResponse<CollectionResponse>> => {
  console.log("Payload received:"); // Log the payload for debugging
  
  try {
    if (currentController) {
      currentController.abort();
    }
    currentController = new AbortController();

    const response = await axiosInstance.post('/admin/collections/getAll');

    if (response.status === 200) {
      return {
        status: response.status,
        message: response.data.message,
        data: response.data.data, // Assuming the API response has a data field with the collection array
      };
    } else {
      throw new Error('Failed to fetch collections');
    }
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    } else {
      console.error("Error fetching collections:", error);
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

    const response = await axiosInstance.delete(`/admin/collections/delete/${id}`);

    if (response.status === 200) {
      return {
        status: response.status,
        message: response.data.message || "Collection deleted successfully",
        data: {
          id: id, // Return the ID of the deleted collection
        },
      };
    } else {
      throw new Error('Failed to delete collection');
    }
  } catch (error: any) {
    console.error("[API] Error deleting collection:", error);
    throw error;
  }
};