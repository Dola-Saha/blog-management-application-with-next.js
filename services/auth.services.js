import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { validateEmail } from "../utils/validateEmail.js";
import { validatePassword, validateRequired } from "../utils/validation.js";

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

export const registerUser = async ({ firstname, lastname, email, password }) => {
    if (!validateRequired({ firstname, lastname, email, password })) {
        throw createError("Firstname, lastname, email and password are required", 400);
    }
    if (!validateEmail(email)) throw createError("Invalid email address", 400);
    if (!validatePassword(password)) throw createError("Password must be at least 8 characters", 400);

    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) throw createError("Email is already registered", 409);

    const hashedPassword = await bcrypt.hash(password, 10);
    return User.create({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.toLowerCase(),
        password: hashedPassword
    });
};

export const loginUser = async ({ email, password }) => {
    if (!validateRequired({ email, password }) || !validateEmail(email)) {
        throw createError("Valid email and password are required", 400);
    }

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user || !user.isActive || !(await bcrypt.compare(password, user.password))) {
        throw createError("Invalid credentials", 401);
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
    );
    return { token, user };
};

export const safeUser = (user) => {
    const data = user.toJSON ? user.toJSON() : user;
    const { password, ...safeData } = data;
    return safeData;
};

export const ensureAdminUser = async () => {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) return;

    const existingAdmin = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingAdmin) {
        existingAdmin.role = "admin";
        existingAdmin.isActive = true;
        await existingAdmin.save();
        return;
    }

    if (!validatePassword(password)) {
        throw createError("ADMIN_PASSWORD must be at least 8 characters", 500);
    }

    await User.create({
        firstname: "Admin",
        lastname: "User",
        email: email.toLowerCase(),
        password: await bcrypt.hash(password, 10),
        role: "admin",
        isActive: true
    });
};