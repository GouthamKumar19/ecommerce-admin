import { LoginRequest, LoginResponse } from "../types/loginTypes";

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Mock data for login response
const mockLoginResponse: LoginResponse = {
  _id: "1234567890abcdef",
  name: "john",
  email: "john123@exelon.com",
  role: "ADMIN",
  access_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC2J9.eyJpYXQiOjE3MTg0NTYyMzAsImV4cCI6MTcyMTA0ODIzMH0.en4E7n7zxBA2OK0nVzW3hGL6i1-hFhnEwGW",
  refresh_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV2CJ9.eyJpYXQiOjE3MTg0NTYyMzEsImV4cCI6MjAzMzgxNjIzMX0.Po_Xc3Jt4GhKWpd1B5cUcHsdZWq_4ElO138VmsU",
  refreshExpiresAt: "2024-07-15T12:57:10.956Z",
};

// Login function
export const login = async (
  loginData: LoginRequest
): Promise<ApiResponse<LoginResponse>> => {
  try {
    console.log("[API] Logging in with data:", loginData);

    // Uncomment when API is ready
    // const response = await axiosInstance.post('/admin/auth/login', loginData);
    // return response.data;

    // Mock response
    const mockResponse: ApiResponse<LoginResponse> = {
      status: 200,
      message: "Login successful",
      data: mockLoginResponse,
    };

    console.log("[API] Mock login response:", mockResponse);
    return Promise.resolve(mockResponse);
  } catch (error) {
    console.error("[API] Error logging in:", error);
    throw error;
  }
};
