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

// Revised Product interface based on the provided JSON structure
export interface Product extends BaseRecord {
  _id: string; // Changed id to _id to match the JSON structure
  name: string;
  description: string;
  price: number;
  slashedPrice?: number; // Changed discountPrice to slashedPrice
  quantity: number;
  isFeatured: boolean; // Changed featured to isFeatured
  categoryId: string; // Required category ID
  subCategoryId: string; // Required sub-category ID
  images: string[]; // Array for multiple images
  thumbnailImage?: string; // Optional thumbnail image
  createdAt: string | Date; // Date of creation
  updatedAt: string | Date; // Date of last update
}

// Example response structure reflecting the overall API response
export interface ApiResponse {
  status: number;
  message: string;
  data: {
    totalCount: number;
    tableData: Product[]; // Array of Product objects
  };
}
