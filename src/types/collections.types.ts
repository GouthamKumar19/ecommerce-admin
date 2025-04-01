// Define possible value types that can be stored in the record
type RecordValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | {
      [key: string]: RecordValue;
    }
  | RecordValue[];

export interface BaseRecord {
  [key: string]: RecordValue; // More specific index signature
}

// Updated Collection interface based on the provided snippet
export interface Collection extends BaseRecord {
  _id: string; // Keeping the name "_id" to match the provided sample data
  name: string;
  bannerImage: string; // Banner image URL
  createdAt: string | Date; // Using string for ISO format compatibility
  updatedAt: string | Date; // Using string for ISO format compatibility
  description?: string; // Optional field
  status?: "active" | "inactive" | "draft"; // Optional field
  featured?: boolean; // Optional field
  startDate?: string | Date; // Optional field
  endDate?: string | Date; // Optional field
  position?: number; // Optional field
  products?: string[] | number[]; // Optional: IDs of products in this collection
  tags?: string[]; // Optional: Tags associated with the collection
  seoTitle?: string; // Optional: SEO Title
  seoDescription?: string; // Optional: SEO Description
  seoKeywords?: string[]; // Optional: SEO Keywords
  customAttributes?: {
    [key: string]: string | number | boolean; // Optional: Custom attributes
  };
}

// Interface for the response structure
export interface ApiResponse<T> {
  status: number; // HTTP status code
  message: string; // Response message
  data: T;
}

// Revised Product interface based on the provided JSON structure
export interface Product extends BaseRecord {
  _id: string;
  name: string;
  description: string;
  price: number;
  slashedPrice?: number;
  quantity: number;
  isFeatured: boolean; // Changed featured to isFeatured
  categoryId: string; // Required category ID
  subCategoryId: string; // Required sub-category ID
  // images: string[]; // Array for multiple images
  thumbnailImage?: string; // Optional thumbnail image
  createdAt?: string | Date; // Date of creation
  updatedAt: string | Date; // Date of last update
}

// Example response structure reflecting the overall API response
export interface ProductResponse {
  totalCount: number;
  tableData: Product[];
}

// Example response structure for collections
export interface CollectionResponse {
  totalCount: number;
  tableData: Collection[];
}

export type SortDirection = "ascending" | "descending" | null;
export interface SortConfig {
  key: string;
  direction: SortDirection;
}