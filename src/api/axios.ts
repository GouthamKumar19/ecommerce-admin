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

    const message = response.data?.toastMessage;

    if (
      message &&
      message.toLowerCase() !== "success" &&
      message !== "User details fetched successfully" &&
      message !== "An unexpected error occurred" &&
      message !== "All subcategories updated successfully" &&
      message !== "Order updated successfully" &&
      message !== lastToastMessage
    ) {
      lastToastMessage = message;
      toast.success(message);

      // Reset lastToastMessage after 2 seconds to allow future duplicates
      setTimeout(() => {
        lastToastMessage = "";
      }, 2000);
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;
    console.log("error in axios instance", error);

    if (error.message === "Network Error") {
      toast.error("Network error. Please check your connection.");
      return Promise.reject(error);
    }

    const errorMessage =
      (error.response?.data as any)?.toastMessage ||
      (error.response?.data as any)?.error ||
      error.message;

    if (errorMessage && errorMessage !== lastToastMessage) {
      lastToastMessage = errorMessage;

      if (errorMessage === "canceled") {
        return;
      }

      toast.error(errorMessage);

      // Reset lastToastMessage after 2 seconds to allow future duplicates
      setTimeout(() => {
        lastToastMessage = "";
      }, 2000);
    }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
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

        const response = await axios.post(
          `${baseURL}/admin/auth/refresh`,
          { refresh_token: refreshToken },
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        const { accessToken, tokenExpiresAt } = response.data.data;

        Cookies.set("access_token", accessToken);
        Cookies.set("token_expires_at", tokenExpiresAt);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);
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
