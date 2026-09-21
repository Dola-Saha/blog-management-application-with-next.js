import jwt from "jsonwebtoken";

const authMiddleWare = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authentication token is required" });
    }

    try {
        const token = authHeader.split(" ")[1];
        req.user = jwt.verify(token, process.env.SECRET_KEY);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired authentication token" });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only" });
    }
    next();
};

export default authMiddleWare;