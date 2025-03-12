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

export interface Collection extends BaseRecord {
  id: string | number;
  name: string;
  description?: string;
  imageUrl: string;
  status: "active" | "inactive" | "draft";
  createdAt: string | Date;
  updatedAt: string | Date;
  featured?: boolean;
  startDate?: string | Date;
  endDate?: string | Date;
  position?: number;
  products?: string[] | number[]; // IDs of products in this collection
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  customAttributes?: {
    [key: string]: string | number | boolean;
  };
}