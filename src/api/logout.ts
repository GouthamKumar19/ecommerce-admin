import { ApiResponse } from "../types/logout";

// Mock data for logout response
const mockLogoutResponse = {
  status: 200,
  message: "Logout successful",
  data: "User has been logged out successfully",
  toastMessage: "Logout Successful",
};

// Logout function
export const logout = async (
  token: string,
  refreshToken: string
): Promise<ApiResponse<string>> => {
  try {
    console.log("[API] Logging out with token:", token);
    console.log("[API] Using refresh token:", refreshToken);

    // Uncomment when API is ready
    // const response = await axiosInstance.post('/admin/auth/logout', { refresh_token: refreshToken }, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     'Content-Type': 'application/json',
    //   },
    // });
    // return response.data;

    // Mock response
    const mockResponse: ApiResponse<string> = mockLogoutResponse;

    console.log("[API] Mock logout response:", mockResponse);
    return Promise.resolve(mockResponse);
  } catch (error) {
    console.error("[API] Error logging out:", error);
    throw error;
  }
};
