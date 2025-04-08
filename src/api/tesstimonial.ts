import axiosInstance from "./axios";
import {
  Testimonial,
  TestimonialResponse,
  ApiResponse,
  SortConfig,
} from "../types/testimonials.types";
let currentController: AbortController | null = null;
interface TestimonialFormData {
  _id?: string;
  name: string;
  ratings: number;
  description: string;
}

// Create a new testimonial
export const createTestimonial = async (
  testimonialData: TestimonialFormData
): Promise<ApiResponse<string>> => {
  try {
    console.log("[API] Creating testimonial with data:", testimonialData);

    const response = await axiosInstance.post(
      "/admin/testimonials/create-update",
      testimonialData
    );
    return response.data as ApiResponse<string>;
  } catch (error) {
    console.error("[API] Error creating testimonial:", error);
    throw error;
  }
};

// Update an existing testimonial
export const updateTestimonial = async (
  testimonialData: TestimonialFormData
): Promise<ApiResponse<string>> => {
  try {
    console.log("[API] Updating testimonial with data:", testimonialData);

    const response = await axiosInstance.post(
      "/admin/testimonials/create-update",
      testimonialData
    );
    return response.data as ApiResponse<string>;
  } catch (error) {
    console.error("[API] Error updating testimonial:", error);
    throw error;
  }
};

// Get a testimonial by ID
export const getTestimonialById = async (
  id: string
): Promise<ApiResponse<Testimonial>> => {
  try {
    console.log("[API] Fetching testimonial with ID:", id);

    const response = await axiosInstance.post(
      `/admin/testimonials/getOne/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("[API] Error fetching testimonial:", error);
    throw error;
  }
};

// Get all testimonials
export const getAllTestimonials = async (
  page: number,
  itemsPerPage: number,
  searchTerm: string,
  sortConfig: SortConfig
): Promise<ApiResponse<TestimonialResponse>> => {
  try {
    if (currentController) {
      currentController.abort();
    }
    currentController = new AbortController();
    console.log("[API] Fetching all testimonials");

    const response = await axiosInstance.post(
      "/admin/testimonials/getAll",
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
    return response.data;
  } catch (error) {
    console.error("[API] Error fetching all testimonials:", error);
    throw error;
  }
};
