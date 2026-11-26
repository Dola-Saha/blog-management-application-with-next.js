import app from "./app.js";
import sequelize, { createDatabase } from "./config/db.js";
import "./models/blog.model.js";
import { ensureAdminUser } from "./services/auth.services.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config({ path: fileURLToPath(new URL(".env", import.meta.url)) });

const PORT = process.env.PORT || 5000;

try {
    await createDatabase();
    await sequelize.authenticate();

    const [columns] = await sequelize.query("SHOW COLUMNS FROM `users`");
    const names = new Set(columns.map((column) => column.Field));

    if (!names.has("profileImage")) {
        await sequelize.query("ALTER TABLE `users` ADD COLUMN `profileImage` VARCHAR(255) NULL");
    }
    if (!names.has("resetToken")) {
        await sequelize.query("ALTER TABLE `users` ADD COLUMN `resetToken` VARCHAR(255) NULL");
    }
    if (!names.has("resetTokenExpires")) {
        await sequelize.query("ALTER TABLE `users` ADD COLUMN `resetTokenExpires` DATETIME NULL");
    }

    await sequelize.sync();
    await ensureAdminUser();
    console.log("Database is connected");
    app.listen(PORT, () => console.log(`Server is running at ${PORT}`));
} catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
}