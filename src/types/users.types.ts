// Define the possible value types that can be stored in a record
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
  | AddressData[];

// Base interface for records
export interface BaseRecord {
  [key: string]: RecordValue; // More specific index signature
}

// User interface according to the provided JSON structure
export interface User extends BaseRecord {
  _id: string; // Unique identifier for the user
  name: string;
  email: string;
  phone: string;
  isEnabled: boolean; // Indicates if the user is enabled
  addresses: AddressData[]; // Array of AddressData
}

export interface AddressData {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
}
// Interface for the API response
export interface ApiResponse {
  status: number; // Status code of the response
  message: string; // Message indicating the success or failure of the request
  data: {
    totalCount: number; // Total number of records available
    tableData: User[]; // Array of user records
  };
}