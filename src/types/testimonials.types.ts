// Define possible value types that can be stored in the record
type RecordValue = string | number | boolean | null | undefined;

export interface BaseRecord {
  [key: string]: RecordValue; // More specific index signature
}

export interface Testimonial extends BaseRecord {
  id: string | number;
  name: string;
  rating: number;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  // Add any other fields your testimonial has
}
