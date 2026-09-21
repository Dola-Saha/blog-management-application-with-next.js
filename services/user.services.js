import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { validateId, validatePassword, validateRequired } from "../utils/validation.js";
import { safeUser } from "./auth.services.js";

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

export const getAllUsers = async () => {
    const users = await User.findAll({ order: [["id", "ASC"]] });
    return users.map(safeUser);
};

export const getUser = async (id) => {
    if (!validateId(id)) throw createError("Invalid user ID", 400);
    const user = await User.findByPk(id);
    if (!user) throw createError("User not found", 404);
    return safeUser(user);
};

export const updateUserStatus = async (id, isActive) => {
    if (typeof isActive !== "boolean") throw createError("isActive must be boolean", 400);
    if (!validateId(id)) throw createError("Invalid user ID", 400);
    const user = await User.findByPk(id);
    if (!user) throw createError("User not found", 404);
    user.isActive = isActive;
    user.updateAt = new Date();
    await user.save();
    return safeUser(user);
};

export const updateProfile = async (id, { firstname, lastname }) => {
    if (!validateRequired({ firstname, lastname })) throw createError("Firstname and lastname are required", 400);
    const user = await User.findByPk(id);
    if (!user) throw createError("User not found", 404);
    user.firstname = firstname.trim();
    user.lastname = lastname.trim();
    user.updateAt = new Date();
    await user.save();
    return safeUser(user);
};

export const updatePassword = async (id, password) => {
    if (!validatePassword(password)) throw createError("Password must be at least 8 characters", 400);
    const user = await User.findByPk(id);
    if (!user) throw createError("User not found", 404);
    user.password = await bcrypt.hash(password, 10);
    user.updateAt = new Date();
    await user.save();
};