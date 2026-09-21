import { getAllUsers, getUser, updatePassword, updateProfile, updateUserStatus } from "../services/user.services.js";
import { safeUser } from "../services/auth.services.js";
import User from "../models/user.model.js";

const handleError = (res, error) => res.status(error.statusCode || 500).json({ message: error.message });

export const getUsers = async (req, res) => {
    try {
        res.status(200).json({ message: "Users retrieved successfully", data: await getAllUsers() });
    } catch (error) { handleError(res, error); }
};

export const getUserById = async (req, res) => {
    try {
        res.status(200).json({ message: "User retrieved successfully", data: await getUser(req.params.id) });
    } catch (error) { handleError(res, error); }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "Profile retrieved successfully", data: safeUser(user) });
    } catch (error) { handleError(res, error); }
};

export const updateStatus = async (req, res) => {
    try {
        res.status(200).json({ message: "User status updated successfully", data: await updateUserStatus(req.params.id, req.body.isActive) });
    } catch (error) { handleError(res, error); }
};

export const updateOwnProfile = async (req, res) => {
    try {
        res.status(200).json({ message: "Profile updated successfully", data: await updateProfile(req.user.id, req.body) });
    } catch (error) { handleError(res, error); }
};

export const updateOwnPassword = async (req, res) => {
    try {
        await updatePassword(req.user.id, req.body.password);
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) { handleError(res, error); }
};