export type SortDirection = "ascending" | "descending" | null;

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

type RecordValue = string | number | boolean | null | undefined;

export interface BaseRecord {
  [key: string]: RecordValue;
}

export interface Testimonial extends BaseRecord {
  id: string | number;
  _id?: string;
  name: string;
  rating: number;
  ratings: number;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TestimonialResponse {
  totalCount: number;
  tableData: Testimonial[];
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
