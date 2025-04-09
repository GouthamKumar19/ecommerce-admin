export interface AddressData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
}

// Define the possible value types that can be stored in a record
type RecordValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | { [key: string]: RecordValue }
  | RecordValue[]
  | AddressData[]; // Explicitly add AddressData[] as a valid RecordValue type

// Base interface for records
export interface BaseRecord {
  [key: string]: RecordValue; // More specific index signature
}

// User interface according to the provided JSON structure
export interface User extends BaseRecord {
  _id?: string; // Unique identifier for the user
  id?: string; // Alternative id field
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  gender?: string;
  countryCode?: string;
  isEnabled?: boolean; // Indicates if the user is enabled
  addresses?: AddressData[];
}

// Interface for the API response
export interface UserResponse {
  totalCount: number;
  tableData: User[];
}

// Generic API response interface
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
export type SortDirection = "ascending" | "descending" | null;

export interface SortConfig {
  key: string;
  direction: SortDirection;
}