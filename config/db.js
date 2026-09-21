import mysql from "mysql2/promise";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const databaseName = process.env.DB_NAME || "blogdb";

export const createDatabase = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
    await connection.end();
};

const sequelize = new Sequelize(
    databaseName,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        logging: false
    }
);

export default sequelize;