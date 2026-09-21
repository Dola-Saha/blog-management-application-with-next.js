import app from "./app.js";
import sequelize, { createDatabase } from "./config/db.js";
import "./models/blog.model.js";
import { ensureAdminUser } from "./services/auth.services.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

try {
    await createDatabase();
    await sequelize.authenticate();
    await sequelize.sync();
    await ensureAdminUser();
    console.log("Database is connected");
    app.listen(PORT, () => console.log(`Server is running at ${PORT}`));
} catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
}