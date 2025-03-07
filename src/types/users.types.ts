// Define possible value types that can be stored in the record
type RecordValue = string | number | boolean | null | undefined | Date | {
    [key: string]: RecordValue;
} | RecordValue[];

export interface BaseRecord {
    [key: string]: RecordValue;  // More specific index signature
}

export interface User extends BaseRecord {
    id: string | number;
    name: string;
    email: string;
    phone: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    status?: 'active' | 'inactive';
    role?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
    // Add any other specific fields your user type needs
}