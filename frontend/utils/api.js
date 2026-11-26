import axios from "axios";
import { clearAuthStorage, getToken } from "@/utils/auth";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;
    const isAuthenticationError =
      error.response?.status === 401 &&
      (message === "Authentication token is required" ||
        message === "Invalid or expired authentication token");
    const isLoginRequest = error.config?.url?.includes("/api/auth/login");

    if (typeof window !== "undefined" && isAuthenticationError && !isLoginRequest) {
      clearAuthStorage();
      sessionStorage.setItem("session-expired", "1");
      window.location.replace("/login?session=expired");
    }

    return Promise.reject(error);
  }
);

export const getErrorMessage = (error, fallback = "Something went wrong") =>
  error.response?.data?.message || (error.request ? "Cannot reach the server" : fallback);

export const photoUrl = (path) => {
  if (!path) return null;
  return path.startsWith("http") ? path : `${API_URL}${path}`;
};

export default api;
