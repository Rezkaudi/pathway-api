import path from "path";
import cors from 'cors';
import dotenv from 'dotenv';
import express from "express";

import { logger } from './middleware/loggerMiddleware';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';


export async function startServer() {

    const app = express();
    dotenv.config();

    const PORT = process.env.PORT || 5000;
    const SERVER_URL = process.env.SERVER_URL


    app.use(cors());
    app.use(logger);
    app.use(express.json());
    app.use(express.static("public"));
    app.use(express.urlencoded({ extended: false }));


    //Bublic Routes 
    app.get("/", (_, res) => {
        res.sendFile(path.join(__dirname, "..", "..", "public", "index.html"));
    });

    app.use('/api/auth', require('./routes/authRoutes'));


    // Error handler
    app.use(notFoundHandler);
    app.use(errorHandler);


    // Start server
    return new Promise<void>((resolve) => {
        app.listen(PORT, () => {
            console.log(`Server is running on ${SERVER_URL}`);
            resolve();
        });
    });
}
