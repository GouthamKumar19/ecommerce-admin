import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const baseURL = import.meta.env.VITE_API_URL;

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Track the last toast message to prevent duplicates
let lastToastMessage = "";

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("response in axios instance", response);
    if (
      response.data?.toastMessage &&
      response.data.toastMessage !== "User details fetched successfully" &&
      response.data.toastMessage !== "An unexpected error occurred" &&
      response.data.toastMessage !== lastToastMessage // Check if this is a new message
    ) {
      console.log("response in axios instance inside if", response);
      // Update the last toast message before showing it
      lastToastMessage = response.data.toastMessage;
      toast.success(response.data.toastMessage);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;
    console.log("error in axios instance", error);

    // Handle network errors
    if (error.message === "Network Error") {
      toast.error("Network error. Please check your connection.");
      return Promise.reject(error);
    }

    // Check if the error is 401 and the request is not a refresh token request
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Mark this request as retried

      if (isRefreshing) {
        // If token refresh is in progress, queue the failed request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        const refreshToken = Cookies.get("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(`${baseURL}/admin/auth/refresh`, {
          refresh_token: refreshToken,
        }, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          },
          withCredentials: true // Ensure withCredentials is set to true
        });

        const { accessToken, tokenExpiresAt } = response.data.data;

        // Update cookies with new tokens
        Cookies.set("access_token", accessToken);
        Cookies.set("token_expires_at", tokenExpiresAt);

        // Update Authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process queued requests
        processQueue(null, accessToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);
        // Clear cookies and redirect to login
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("token_expires_at");
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;