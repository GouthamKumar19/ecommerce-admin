// Define the types for the login request and response

export interface LoginRequest {
  email: string;
  password: string;
  googleId?: string;
  appleId?: string;
}

export interface LoginResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  access_token: string;
  refresh_token: string;
  refreshExpiresAt: string;
}
