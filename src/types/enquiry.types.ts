// Define possible value types that can be stored in the record
type RecordValue = string | number | boolean | null | undefined;

export interface BaseRecord {
  [key: string]: RecordValue; // More specific index signature
}

// Enquiry interface reflecting the structure of a single enquiry
export interface Enquiry extends BaseRecord {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string; // Using string to represent date/time
  updatedAt: string; // Using string to represent date/time
}

// Interface for the response structure
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Interface for the data structure containing totalCount and totalData
export interface EnquiryData {
  totalCount: number; // Total number of enquiries
  totalData: Enquiry[]; // An array of Enquiry objects
}