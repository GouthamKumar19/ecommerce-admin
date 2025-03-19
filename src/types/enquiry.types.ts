// types/enquiry.types.ts

// Define possible value types that can be stored in the record
type RecordValue = string | number | boolean | null | undefined;

export interface BaseRecord {
  [key: string]: RecordValue; // More specific index signature
}

// Updated Enquiry interface reflecting the structure of a single enquiry
export interface Enquiry extends BaseRecord {
  _id: string; // Changed to _id to match the provided JSON
  name: string;
  email: string;
  message: string;
  createdAt: string; // Using string to represent date/time
  updatedAt: string; // Using string to represent date/time
}

// Interface for the response structure
export interface EnquiryResponse {
  message: string;
  data: EnquiryData; // Reference to the EnquiryData interface
}

// Interface for the data structure containing totalCount and totalData
export interface EnquiryData {
  totalCount: number; // Total number of enquiries
  totalData: Enquiry[]; // An array of Enquiry objects
}