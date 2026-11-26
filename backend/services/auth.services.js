import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { normalizeEmail, validateEmail } from "../utils/validateEmail.js";
import { validatePassword, validateRequired } from "../utils/validation.js";
import { verifyPassword } from "../utils/password.js";

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

export const registerUser = async ({ firstname, lastname, email, password }) => {
    if (!validateRequired({ firstname, lastname, email, password })) {
        throw createError("Firstname, lastname, email and password are required", 400);
    }
    const normalizedEmail = normalizeEmail(email);
    if (!validateEmail(normalizedEmail)) throw createError("Invalid email address", 400);
    if (!validatePassword(password)) throw createError("Password must be at least 8 characters", 400);

    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) throw createError("Email is already registered", 409);

    const hashedPassword = await bcrypt.hash(password, 10);
    return User.create({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        isActive: true
    });
};

export const loginUser = async ({ email, password }) => {
    if (!validateRequired({ email, password })) {
        throw createError("Valid email and password are required", 400);
    }

    const normalizedEmail = normalizeEmail(email);
    if (!validateEmail(normalizedEmail)) {
        throw createError("Valid email and password are required", 400);
    }

    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user || !user.isActive) {
        throw createError("Invalid credentials", 401);
    }

    const passwordCheck = await verifyPassword(password, user.password);
    if (!passwordCheck.matches) throw createError("Invalid credentials", 401);

    if (passwordCheck.upgradedHash) {
        user.password = passwordCheck.upgradedHash;
        await user.save();
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );
    return { token, user };
};

export const safeUser = (user) => {
    const data = user.toJSON ? user.toJSON() : user;
    const { password, ...safeData } = data;
    return safeData;
};

export const ensureAdminUser = async () => {
    const email = process.env.GMAIL;
    const password = process.env.GMAIL_APP_PASSWORD;

    if (!email || !password) return;

    const normalizedEmail = normalizeEmail(email);
    const existingAdmin = await User.findOne({ where: { email: normalizedEmail } });
    if (existingAdmin) {
        existingAdmin.role = "admin";
        existingAdmin.isActive = true;
        await existingAdmin.save();
        return;
    }

    if (!validatePassword(password)) {
        throw createError("GMAIL_APP_PASSWORD must be at least 8 characters", 500);
    }

    await User.create({
        firstname: "Admin",
        lastname: "User",
        email: normalizedEmail,
        password: await bcrypt.hash(password, 10),
        role: "admin",
        isActive: true
    });
};