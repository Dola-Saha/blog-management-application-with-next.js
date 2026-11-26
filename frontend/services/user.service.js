import api from "@/utils/api";

export const getProfile = () => api.get("/api/users/profile");
export const updateProfile = (payload) => api.put("/api/users/profile/update", payload);
export const updatePassword = (password) => api.patch("/api/users/password", { password });
export const uploadProfileImage = (file) => {
  const data = new FormData();
  data.append("image", file);
  return api.patch("/api/users/profile/image", data);
};
export const getUsers = () => api.get("/api/users");
export const getUser = (id) => api.get(`/api/users/${id}`);
export const updateUserStatus = (id, isActive) => api.patch(`/api/users/${id}/status`, { isActive });
