import axios from 'axios';
import { Collection, CollectionResponse } from '../types/collections.types';
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
  try {
    if (currentController) {
      currentController.abort();
    }
    currentController = new AbortController();

    console.log("[API] Fetching all collections");
    
    const response = await axiosInstance.post('/admin/collections/getAll', {}, {
      signal: currentController.signal
    });

    console.log("[API] All collections response:", response.data);
    
    return {
      status: response.status,
      message: response.data.message || "Collections retrieved successfully",
      data: response.data.data,
    };
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.log("[API] Request canceled:", error.message);
    } else {
      console.error("[API] Error fetching collections:", error.message);
    }
    throw error;
  }
};

// Helper function to check if a URL is base64 encoded
const isBase64Image = (str: string): boolean => {
  return str.startsWith('data:image');
};

// Helper function to resize base64 image
const resizeBase64Image = async (base64: string, maxSize: number = 1000): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate the new dimensions
      if (width > height && width > maxSize) {
        height = Math.round((height * maxSize) / width);
        width = maxSize;
      } else if (height > maxSize) {
        width = Math.round((width * maxSize) / height);
        height = maxSize;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Get the data URL with reduced quality (0.7 = 70% quality)
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    
    img.onerror = (err) => {
      reject(err);
    };
    
    img.src = base64;
  });
};

export const createCollection = async (
  collectionData: CollectionFormData
): Promise<ApiResponse<Collection>> => {
  try {
    console.log("[API] Creating collection with name:", collectionData.name);
    
    // Check if the bannerImage is a base64 string (data URL) that needs resizing
    let bannerImage = collectionData.bannerImage;
    if (isBase64Image(bannerImage)) {
      console.log("[API] Detected base64 image, resizing to reduce payload size");
      try {
        bannerImage = await resizeBase64Image(bannerImage);
        console.log("[API] Image resized successfully");
      } catch (resizeError) {
        console.error("[API] Error resizing image:", resizeError);
      }
    }

    // Make sure the data is properly formatted before sending
    const payload = {
      name: collectionData.name.trim(),
      bannerImage: bannerImage,
    };

    console.log("[API] Sending collection data with payload size:", 
      JSON.stringify(payload).length, "bytes");

    // If the payload is still too large, split the request
    if (JSON.stringify(payload).length > 1000000) { // 1MB threshold
      console.log("[API] Payload too large, using alternative method");
      
      // First, create the collection with just the name
      const initialResponse = await axiosInstance.post('/admin/collections/create', {
        name: payload.name,
        bannerImage: "" // Empty initially
      });
      
      // If first request successful, update with the image in a second request
      if (initialResponse.status === 200 && initialResponse.data.data?.id) {
        const collectionId = initialResponse.data.data.id;
        console.log("[API] Collection created with ID:", collectionId, "now updating with image");
        
        // Update with the image
        const updateResponse = await axiosInstance.put(`/admin/collections/update/${collectionId}`, {
          name: payload.name,
          bannerImage: payload.bannerImage
        });
        
        return {
          status: updateResponse.status,
          message: "Collection created and image updated successfully",
          data: updateResponse.data.data,
        };
      } else {
        return {
          status: initialResponse.status,
          message: initialResponse.data.message || "Collection created without image",
          data: initialResponse.data.data,
        };
      }
    } else {
      // Standard request if payload isn't too large
      const response = await axiosInstance.post('/admin/collections/create', payload);
      
      console.log("[API] Create collection response:", response.data);
      
      return {
        status: response.status,
        message: response.data.message || "Collection created successfully",
        data: response.data.data,
      };
    }
  } catch (error: any) {
    // Check if the error is a 413 Payload Too Large
    if (error.response && error.response.status === 413) {
      console.error("[API] Payload too large (413):", error.response.data);
      throw new Error("Image is too large. Please use a smaller image or compress it before uploading.");
    } else if (error.response) {
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
    
    // Check if the bannerImage is a base64 string that needs resizing
    let bannerImage = collectionData.bannerImage;
    if (isBase64Image(bannerImage)) {
      console.log("[API] Detected base64 image, resizing to reduce payload size");
      try {
        bannerImage = await resizeBase64Image(bannerImage);
        console.log("[API] Image resized successfully");
      } catch (resizeError) {
        console.error("[API] Error resizing image:", resizeError);
      }
    }

    // Format the payload
    const payload = {
      name: collectionData.name.trim(),
      bannerImage: bannerImage,
    };
    
    console.log("[API] Sending update with payload size:", 
      JSON.stringify(payload).length, "bytes");

    // Handle large payloads for update too
    if (JSON.stringify(payload).length > 1000000) { // 1MB threshold
      console.log("[API] Update payload too large, using alternative method");
      
      // First update just the name
      const nameResponse = await axiosInstance.put(`/admin/collections/update/${id}`, {
        name: payload.name,
        bannerImage: collectionData.bannerImage.startsWith('http') ? collectionData.bannerImage : ""
      });
      
      // Then update the image separately if needed
      if (!collectionData.bannerImage.startsWith('http') && bannerImage) {
        console.log("[API] Updating image separately");
        const imageResponse = await axiosInstance.put(`/admin/collections/update/${id}`, {
          name: payload.name,
          bannerImage: bannerImage
        });
        
        return {
          status: imageResponse.status,
          message: "Collection name and image updated successfully",
          data: imageResponse.data.data,
        };
      } else {
        return {
          status: nameResponse.status,
          message: nameResponse.data.message || "Collection updated successfully",
          data: nameResponse.data.data,
        };
      }
    } else {
      // Standard update if payload isn't too large
      const response = await axiosInstance.put(`/admin/collections/update/${id}`, payload);
      
      console.log("[API] Update collection response:", response.data);
      
      return {
        status: response.status,
        message: response.data.message || "Collection updated successfully",
        data: response.data.data,
      };
    }
  } catch (error: any) {
    // Check if the error is a 413 Payload Too Large
    if (error.response && error.response.status === 413) {
      console.error("[API] Payload too large (413):", error.response.data);
      throw new Error("Image is too large. Please use a smaller image or compress it before uploading.");
    } else {
      console.error("[API] Error updating collection:", error.response?.data || error.message);
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