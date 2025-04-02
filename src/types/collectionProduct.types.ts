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
  _id: string;
  productDetails: {
    thumbnailImage: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
  };
  slashedPrice?: number;
  isFeatured: boolean;
  categoryId: string;
  subCategoryId: string;
  images: string[];
  thumbnailImage?: string;
  createdAt?: string | Date;
  updatedAt: string | Date;
}

// Example response structure reflecting the overall API response
export interface ProductResponse {
  totalCount: number;
  tableData: Product[];
}

export interface ApiResponse<T> {
  status: number; // HTTP status code
  message: string; // Response message
  data: T;
}

