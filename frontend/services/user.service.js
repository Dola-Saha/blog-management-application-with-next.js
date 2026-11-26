import api from "@/utils/api";

export const getProfile = () => api.get("/users/profile");
export const updateProfile = (payload) => api.put("/users/profile/update", payload);
export const updatePassword = (password) => api.patch("/users/password", { password });
export const uploadProfileImage = (file) => {
  const data = new FormData();
  data.append("image", file);
  return api.patch("/users/profile/image", data);
};
export const getUsers = () => api.get("/users");
export const getUser = (id) => api.get(`/users/${id}`);
export const updateUserStatus = (id, isActive) => api.patch(`/users/${id}/status`, { isActive });
