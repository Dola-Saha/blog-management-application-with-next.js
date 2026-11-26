import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import blogRoute from "./routes/blog.route.js";

dotenv.config({ path: fileURLToPath(new URL(".env", import.meta.url)) });

const app = express();
const currentDir = path.dirname(fileURLToPath(import.meta.url));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(currentDir, "uploads")));

app.get("/", (req, res) => {
    res.json({
        message: "Blog Management API is running",
        frontend: "http://localhost:3000",
        api: "/api",
    });
});

app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", blogRoute);

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
});

export default app;