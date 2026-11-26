import api from "@/utils/api";

export const getBlogs = (params = {}) => api.get("/api/blogs", { params });
export const getBlog = (id) => api.get(`/api/blogs/${id}`);
export const createBlog = (payload) => api.post("/api/blogs/create", payload);
export const updateBlog = (id, payload) => api.put(`/api/blogs/update/${id}`, payload);
export const deleteBlog = (id) => api.delete(`/api/blogs/delete/${id}`);
