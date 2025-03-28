import axiosInstance from "./axios";
import {
  Testimonial,
  TestimonialResponse,
  ApiResponse,
} from "../types/testimonials.types";

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
export const getAllTestimonials = async (): Promise<
  ApiResponse<TestimonialResponse>
> => {
  try {
    console.log("[API] Fetching all testimonials");

    const response = await axiosInstance.post("/admin/testimonials/getAll");
    return response.data;
  } catch (error) {
    console.error("[API] Error fetching all testimonials:", error);
    throw error;
  }
};
