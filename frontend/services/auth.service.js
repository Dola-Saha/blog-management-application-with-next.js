import api from "@/utils/api";

export const register = (payload) => api.post("/api/auth/register", payload);
export const login = (payload) => api.post("/api/auth/login", payload);
export const forgotPassword = (email) => api.post("/api/auth/forgot-password", { email });
export const resetPassword = (token, password) => api.patch(`/api/auth/reset-password/${token}`, { password });
