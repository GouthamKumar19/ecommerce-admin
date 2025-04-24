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

export interface DataResponse extends BaseRecord {
  totalOrders: number;
  totalEnquiries: number;
  totalRevenue: number;
  totalUsers: number;
  newOrders: number;
  confirmedOrders: number;
  graphData: {
    xaxis: string;
    yaxis: number;
  }[]; // An array of graph data points
}