import { Op } from "sequelize";
import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";
import { validateId, validateRequired } from "../utils/validation.js";

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const blogFields = ["id", "blogTitle", "blog", "category", "createAt", "updateAt"];
const authorFields = ["id", "firstname", "lastname", "profileImage"];

const blogInclude = {
    model: User,
    as: "author",
    attributes: authorFields
};

export const getBlogs = async ({ title, category }) => {
    const where = {};
    if (title) where.blogTitle = { [Op.like]: `%${title}%` };
    if (category) where.category = category;

    return Blog.findAll({
        where,
        attributes: blogFields,
        include: [blogInclude],
        order: [["id", "DESC"]]
    });
};

export const getBlog = async (id) => {
    if (!validateId(id)) throw createError("Invalid blog ID", 400);
    const blog = await Blog.findByPk(id, { attributes: blogFields, include: [blogInclude] });
    if (!blog) throw createError("Blog not found", 404);
    return blog;
};

export const createBlog = async (userId, data) => {
    const { blogTitle, blog, category } = data;
    if (!validateRequired({ blogTitle, blog, category })) {
        throw createError("Blog title, blog content and category are required", 400);
    }
    return Blog.create({ userId, blogTitle: blogTitle.trim(), blog: blog.trim(), category: category.trim() });
};

const getOwnedBlog = async (id, user) => {
    if (!validateId(id)) throw createError("Invalid blog ID", 400);
    const blog = await Blog.findByPk(id);
    if (!blog) throw createError("Blog not found", 404);
    if (user.role !== "admin" && blog.userId !== user.id) {
        throw createError("You are not authorized to manage this blog", 403);
    }
    return blog;
};

export const updateBlog = async (id, user, data) => {
    const { blogTitle, blog, category } = data;
    if (!validateRequired({ blogTitle, blog, category })) {
        throw createError("Blog title, blog content and category are required", 400);
    }
    const existingBlog = await getOwnedBlog(id, user);
    existingBlog.blogTitle = blogTitle.trim();
    existingBlog.blog = blog.trim();
    existingBlog.category = category.trim();
    existingBlog.updateAt = new Date();
    await existingBlog.save();
    return existingBlog;
};

export const deleteBlog = async (id, user) => {
    const blog = await getOwnedBlog(id, user);
    await blog.destroy();
};