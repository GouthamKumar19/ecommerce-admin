export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
