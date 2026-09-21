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