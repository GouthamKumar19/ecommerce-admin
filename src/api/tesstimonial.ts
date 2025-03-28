import axiosInstance from "./axios";
import {
  Testimonial,
  TestimonialResponse,
  ApiResponse,
} from "../types/testimonials.types";
import { testimonials } from "../config/mock/testimonialsTable";

interface TestimonialFormData {
  _id?: string;
  name: string;
  ratings: number;
  description: string;
}

// Create a new testimonial
export const createTestimonial = async (
  testimonialData: TestimonialFormData
): Promise<ApiResponse<Testimonial>> => {
  try {
    console.log("[API] Creating testimonial with data:", testimonialData);

    // Uncomment when API is ready
    // const response = await axiosInstance.post('/admin/testimonials/create-update', testimonialData);
    // return response.data;

    // Mock response
    const mockResponse: ApiResponse<Testimonial> = {
      status: 200,
      message: "Testimonial created successfully",
      data: {
        id: String(testimonials.length + 1),
        _id: String(testimonials.length + 1),
        name: testimonialData.name,
        rating: testimonialData.ratings,
        ratings: testimonialData.ratings,
        description: testimonialData.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    console.log("[API] Mock create response:", mockResponse);
    return Promise.resolve(mockResponse);
  } catch (error) {
    console.error("[API] Error creating testimonial:", error);
    throw error;
  }
};

// Update an existing testimonial
export const updateTestimonial = async (
  testimonialData: TestimonialFormData
): Promise<ApiResponse<Testimonial>> => {
  try {
    console.log("[API] Updating testimonial with data:", testimonialData);

    // Uncomment when API is ready
    // const response = await axiosInstance.post('/admin/testimonials/create-update', testimonialData);
    // return response.data;

    // Mock response
    const mockResponse: ApiResponse<Testimonial> = {
      status: 200,
      message: "Testimonial updated successfully",
      data: {
        id: testimonialData._id!,
        _id: testimonialData._id!,
        name: testimonialData.name,
        rating: testimonialData.ratings,
        ratings: testimonialData.ratings,
        description: testimonialData.description,
        updatedAt: new Date().toISOString(),
        createdAt: "2023-07-15T08:00:00Z", // Mock original creation date
      },
    };

    console.log("[API] Mock update response:", mockResponse);
    return Promise.resolve(mockResponse);
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

    // Uncomment when API is ready
    // const response = await axiosInstance.get(`/admin/testimonials/getOne/${id}`);
    // return response.data;

    // Mock response using testimonials data
    const testimonial = testimonials.find((t) => t.id === id || t._id === id);

    if (!testimonial) {
      throw new Error("Testimonial not found");
    }

    const mockResponse: ApiResponse<Testimonial> = {
      status: 200,
      message: "Success",
      data: {
        id: testimonial.id,
        _id: testimonial._id || String(testimonial.id),
        name: testimonial.name,
        rating: testimonial.rating,
        ratings: testimonial.ratings || testimonial.rating,
        description: testimonial.description,
        createdAt: testimonial.createdAt || "2023-07-15T08:00:00Z",
        updatedAt: testimonial.updatedAt || "2023-07-15T08:00:00Z",
      },
    };

    console.log("[API] Mock get response:", mockResponse);
    return Promise.resolve(mockResponse);
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

    // Uncomment when API is ready
     const response = await axiosInstance.post('/admin/testimonials/getAll');
    return response.data;

    // Mock response
    const mockResponse: ApiResponse<TestimonialResponse> = {
      status: 200,
      message: "Success",
      data: {
        totalCount: 2,
        tableData: [
          {
            id: "66b3279c39c21f7342c1520a",
            _id: "66b3279c39c21f7342c1520a",
            name: "John Doe",
            ratings: 5,
            rating: 5, // Adding rating to match the Testimonial type
            description: "Excellent service, highly recommend!",
            createdAt: "2025-02-01T08:00:00Z",
            updatedAt: "2025-02-01T08:00:00Z",
          },
          {
            id: "66b3279c39c21f7342c1520b",
            _id: "66b3279c39c21f7342c1520b",
            name: "Jane Smith",
            ratings: 4,
            rating: 4, // Adding rating to match the Testimonial type
            description: "Good service but could be improved.",
            createdAt: "2025-02-01T08:00:00Z",
            updatedAt: "2025-02-01T08:00:00Z",
          },
        ],
      },
    };

    console.log("[API] Mock getAll response:", mockResponse);
    return Promise.resolve(mockResponse);
  } catch (error) {
    console.error("[API] Error fetching all testimonials:", error);
    throw error;
  }
};
