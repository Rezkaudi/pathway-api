import dotenv from "dotenv";

dotenv.config();

export const CONFIG = {
    NODE_ENV: process.env.NODE_ENV || "development",
    FRONT_URL: process.env.FRONT_URL || "http://localhost:3000",
    SERVER_URL: process.env.SERVER_URL || "http://localhost:8080",
    PORT: process.env.PORT || 8080,

    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_PASS: process.env.GMAIL_PASS,

    DEV_MONGODB_URI: process.env.DEV_MONGODB_URI,

    JWT_SECRET: process.env.JWT_SECRET || "",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",

    JWT_EXPIRATION: "24h",
    REFRESH_TOKEN_EXPIRATION: "7d",


    JWT_SECRET_ACCESS_TOKEN: {
        token: process.env.JWT_SECRET || "",
        age: "1d"
    },

    JWT_SECRET_REFRESH_TOKEN: {
        token: process.env.REFRESH_TOKEN_SECRET || "",
        age: "7d"
    },

    ACCESS_TOKEN_COOKIE: {
        name: "accessToken",
        age: 1 * 24 * 60 * 60 * 1000,// 1 day
    },

    REFRESH_TOKEN_COOKIE: {
        name: "refreshToken",
        age: 7 * 24 * 60 * 60 * 1000,// 7 day
    },

    SALT_ROUNDS_BCRYPT: 10

};