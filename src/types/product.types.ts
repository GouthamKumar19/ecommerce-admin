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

export interface Product extends BaseRecord {
  id: string | number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  featured: boolean;
  imageUrl: string;
  category?: string;
  sku?: string;
  brand?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  status?: "in-stock" | "out-of-stock" | "low-stock";
  tags?: string[];
  rating?: number;
  reviews?: {
    userId: string | number;
    rating: number;
    comment: string;
    date: string | Date;
  }[];
  specifications?: {
    [key: string]: string | number | boolean;
  };
  variants?: {
    id: string | number;
    name: string;
    price?: number;
    quantity?: number;
    attributes?: {
      [key: string]: string | number;
    };
  }[];
}
