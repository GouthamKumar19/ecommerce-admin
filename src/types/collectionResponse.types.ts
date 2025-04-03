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
  | RecordValue[]
  | CollectionProduct[]; // Add CollectionProduct[] to RecordValue

export interface BaseRecord {
  [key: string]: RecordValue; // More specific index signature
}

// Define ProductDetails interface
export interface ProductDetails {
  _id: string;
  name: string;
  description: string;
  price: number;
  slashedPrice: number;
  quantity: number;
  isFeatured: boolean;
  categoryId: string;
  subCategoryId: string;
  images: string[];
  thumbnailImage: string;
  createdAt: string;
  updatedAt: string;
}

// Define CollectionProduct interface
export interface CollectionProduct {
  _id: string;
  collectionId: string;
  productId: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  productDetails: ProductDetails;
}

// Define Collection interface
export interface Collections extends BaseRecord {
  _id: string; // Keeping the name "_id" to match the provided sample data
  name: string;
  bannerImage: string; // Banner image URL
  createdAt: string | Date; // Using string for ISO format compatibility
  updatedAt: string | Date; // Using string for ISO format compatibility
  collectionProducts: CollectionProduct[];
}

// Interface for the response structure
export interface ApiResponse<T> {
  status: number; // HTTP status code
  message: string; // Response message
  data: T;
}

// Example response structure reflecting the overall API response
export interface CollectionResponse {
  status: number;
  message: string;
  data: Collections;
}