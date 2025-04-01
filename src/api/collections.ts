import axios from 'axios';
import { Collection } from '../types/collections.types';
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

export const getAllCollection = async (
  payload: any
): Promise<ApiResponse<Collection[]> | undefined> => {
  console.log("Payload received:", payload); // Log the payload for debugging
  try {
    if (currentController) {
      currentController.abort();
    }
    currentController = new AbortController();

    console.log("[API] Fetching all collections");

    const response = await axiosInstance.post(
      "/admin/collections/getAll",
      payload,
      {
        signal: currentController.signal,
      }
    );
    if (response.status === 200) {
      console.log(response,"DSDSDS");
      return {
        status: response.status,
        message: response.data.message,
        data: response?.data?.data?.tableData,
      };
    } else {
      throw new Error("Failed to fetch enquiries");
    }
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    } else {
      console.error("[API] Error fetching all enquiries:", error);
      return undefined;
    }
  }
};

export const createCollection = async (
  collectionData: CollectionFormData
): Promise<ApiResponse<Collection>> => {
  try {
    console.log("[API] Creating collection with name:", collectionData.name);

    // Make sure the data is properly formatted before sending
    const payload = {
      name: collectionData.name.trim(),
      bannerImage: collectionData.bannerImage,
    };

    console.log("[API] Sending collection data with payload size:", 
      JSON.stringify(payload).length, "bytes");

    const response = await axiosInstance.post('/admin/collections/create', payload);
    
    console.log("[API] Create collection response:", response.data);
    
    return {
      status: response.status,
      message: response.data.message || "Collection created successfully",
      data: response.data.data,
    };
  } catch (error: any) {
    if (error.response) {
      console.error("[API] Server error creating collection:", error.response.data);
      throw new Error(error.response.data.message || "Server error creating collection");
    } else if (error.request) {
      console.error("[API] No response received:", error.request);
      throw new Error("No response from server. Please try again later.");
    } else {
      console.error("[API] Error creating collection:", error.message);
      throw error;
    }
  }
};

export const getCollectionById = async (
  id: string
): Promise<ApiResponse<Collection>> => {
  try {
    console.log("[API] Fetching collection with ID:", id);

    const response = await axiosInstance.post(`/admin/collections/getOne/${id}`);

    console.log("[API] Get collection response:", response.data);
    
    return {
      status: response.status,
      message: response.data.message || "Collection retrieved successfully",
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("[API] Error fetching collection:", error.response?.data || error.message);
    throw error;
  }
};

export const updateCollection = async (
  id: string,
  collectionData: CollectionFormData
): Promise<ApiResponse<Collection>> => {
  try {
    console.log("[API] Updating collection with ID:", id);

    // Format the payload
    const payload = {
      name: collectionData.name.trim(),
      bannerImage: collectionData.bannerImage,
    };
    
    console.log("[API] Sending update with payload size:", 
      JSON.stringify(payload).length, "bytes");

    const response = await axiosInstance.put(`/admin/collections/update/${id}`, payload);
    
    console.log("[API] Update collection response:", response.data);
    
    return {
      status: response.status,
      message: response.data.message || "Collection updated successfully",
      data: response.data.data,
    };
  } catch (error: any) {
    if (error.response) {
      console.error("[API] Server error updating collection:", error.response.data);
      throw new Error(error.response.data.message || "Server error updating collection");
    } else if (error.request) {
      console.error("[API] No response received:", error.request);
      throw new Error("No response from server. Please try again later.");
    } else {
      console.error("[API] Error updating collection:", error.message);
      throw error;
    }
  }
};

export const deleteCollection = async (
  id: string
): Promise<ApiResponse<{ id: string }>> => {
  try {
    console.log("[API] Deleting collection with ID:", id);

    const response = await axiosInstance.delete(`/admin/collections/delete/${id}`);

    console.log("[API] Delete collection response:", response.data);
    
    return {
      status: response.status,
      message: response.data.message || "Collection deleted successfully",
      data: { id },
    };
  } catch (error: any) {
    console.error("[API] Error deleting collection:", error.response?.data || error.message);
    throw error;
  }
};