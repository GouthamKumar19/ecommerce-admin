// types/collection.types.ts

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
export interface ApiResponse {
  status: number; // HTTP status code
  message: string; // Response message
  data: {
    totalCount: number; // Total number of collections
    tableData: Collection[]; // Array of Collection items
  };
}