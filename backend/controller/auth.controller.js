import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { loginUser, registerUser, safeUser } from "../services/auth.services.js";

const handleError = (res, error) => res.status(error.statusCode || 500).json({ message: error.message });

export const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({ message: "User registered successfully", data: safeUser(user) });
    } catch (error) {
        handleError(res, error);
    }
};

export const login = async (req, res) => {
    try {
        const { token, user } = await loginUser(req.body);
        res.status(200).json({ message: "Login successful", data: { token, user: safeUser(user) } });
    } catch (error) {
        handleError(res, error);
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const email = String(req.body.email || "").trim().toLowerCase();
        const user = await User.findOne({ where: { email } });

        if (user) {
            const token = crypto.randomBytes(32).toString("hex");
            user.resetToken = crypto.createHash("sha256").update(token).digest("hex");
            user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
            await user.save();

            const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password/${token}`;
            console.log(`Password reset link: ${resetUrl}`);
        }

        res.status(200).json({ message: "If your email exists, a reset link has been sent" });
    } catch (error) {
        handleError(res, error);
    }
};

export const resetPassword = async (req, res) => {
    try {
        const password = req.body.password;
        if (!password || password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const tokenHash = crypto.createHash("sha256").update(req.params.token).digest("hex");
        const user = await User.findOne({
            where: { resetToken: tokenHash }
        });

        if (!user || !user.resetTokenExpires || user.resetTokenExpires.getTime() < Date.now()) {
            return res.status(400).json({ message: "Reset link is invalid or has expired" });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetToken = null;
        user.resetTokenExpires = null;
        await user.save();

        res.status(200).json({ message: "Password successfully changed" });
    } catch (error) {
        handleError(res, error);
    }
};