// Assuming the BaseRecord is defined in the collection types file
// import { BaseRecord } from "./users.types";// Update the path as necessary
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

// Base interface for records
export interface BaseRecord {
  [key: string]: RecordValue; // More specific index signature
}
// Subcategory interface for individual subcategories
export interface Subcategory extends BaseRecord { // Extending BaseRecord
    _id: string;       // Unique identifier for the subcategory
    name: string;      // Name of the subcategory
    image: string;     // Image URL for the subcategory
    createdAt: string; // Timestamp for when the subcategory was created
    updatedAt: string; // Timestamp for when the subcategory was last updated
}

// Main Category interface for categories and their subcategories
export interface Category extends BaseRecord { // Extending BaseRecord
    _id: string;            // Unique identifier for the category
    name: string;           // Name of the category
    image: string;          // Image URL for the category
    subcategories: Subcategory[]; // Array of subcategory objects
    createdAt: string;      // Timestamp for when the category was created
    updatedAt: string;      // Timestamp for when the category was last updated
}

// ApiResponse interface for the overall structure of the API response
export interface ApiResponse {
    status: number;                   // HTTP status code
    message: string;                  // Message describing the response
    data: {                           // The data section contained in the response
        totalCount: number;           // Total number of categories
        tableData: Category[];        // Array of categories
    };
}

