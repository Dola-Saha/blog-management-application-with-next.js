import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import blogRoute from "./routes/blog.route.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", blogRoute);

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
});

export default app;