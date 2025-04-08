// Base interface for records

// Subcategory interface for individual subcategories
export interface Subcategory {
  _id: string; // Unique identifier for the subcategory
  id: number; // Numeric identifier for the subcategory
  name: string; // Name of the subcategory
  image: string; // Image URL for the subcategory
  images: {
    id: number;
    url: string;
    selected: boolean;
  }[];
  createdAt: string; // Timestamp for when the subcategory was created
  updatedAt: string; // Timestamp for when the subcategory was last updated
}

// Main Category interface for categories and their subcategories
export interface Category {
  _id: string; // Unique identifier for the category
  name: string; // Name of the category
  image: string; // Image URL for the category
  subcategories: Subcategory[]; // Array of subcategory objects
  createdAt: string; // Timestamp for when the category was created
  updatedAt: string; // Timestamp for when the category was last updated
}

// ApiResponse interface for the overall structure of the API response
export interface ApiResponse<T> {
  status: number; // HTTP status code
  message: string;
  data: T; // Message describing the response
}

export interface CategoryResponse {
  totalCount: number;
  tableData: Category[];
}

export interface SubcategoryResponse {
  totalCount: number;
  tableData: Subcategory[];
}

export type SortDirection = "ascending" | "descending" | null;

export interface SortConfig {
  key: string;
  direction: SortDirection;
}