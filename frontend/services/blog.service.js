import api from "@/utils/api";

export const getBlogs = (params = {}) => api.get("/blogs", { params });
export const getBlog = (id) => api.get(`/blogs/${id}`);
export const createBlog = (payload) => api.post("/blogs/create", payload);
export const updateBlog = (id, payload) => api.put(`/blogs/update/${id}`, payload);
export const deleteBlog = (id) => api.delete(`/blogs/delete/${id}`);
