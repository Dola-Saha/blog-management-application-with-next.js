import { createBlog, deleteBlog, getBlog, getBlogs, updateBlog } from "../services/blog.services.js";

const handleError = (res, error) => res.status(error.statusCode || 500).json({ message: error.message });

export const getAllBlogs = async (req, res) => {
    try {
        res.status(200).json({ message: "Blogs retrieved successfully", data: await getBlogs(req.query) });
    } catch (error) { handleError(res, error); }
};

export const getBlogById = async (req, res) => {
    try {
        res.status(200).json({ message: "Blog retrieved successfully", data: await getBlog(req.params.id) });
    } catch (error) { handleError(res, error); }
};

export const create = async (req, res) => {
    try {
        const blog = await createBlog(req.user.id, req.body);
        res.status(201).json({ message: "Blog created successfully", data: blog });
    } catch (error) { handleError(res, error); }
};

export const update = async (req, res) => {
    try {
        const blog = await updateBlog(req.params.id, req.user, req.body);
        res.status(200).json({ message: "Blog updated successfully", data: blog });
    } catch (error) { handleError(res, error); }
};

export const remove = async (req, res) => {
    try {
        await deleteBlog(req.params.id, req.user);
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) { handleError(res, error); }
};