import path from "path";
import cors from 'cors';
import express, { Express } from "express";

import { CONFIG } from "./config/env";

import { logger } from './middleware/loggerMiddleware';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';

export default class Server {
    private app: Express;

    constructor() {
        this.app = express();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandlers();
    }

    private setupMiddleware() {
        this.app.use(cors());
        this.app.use(logger);
        this.app.use(express.json());
        this.app.use(express.static("public"));
        this.app.use(express.urlencoded({ extended: false }));
    }

    private setupRoutes() {
        this.app.get("/", (_, res) => {
            res.sendFile(path.join(__dirname, "..", "..", "public", "index.html"));
        });

        this.app.use('/api/auth', require('./routes/authRoutes'));
    }

    private setupErrorHandlers() {
        this.app.use(notFoundHandler);
        this.app.use(errorHandler);
    }

    public async run(): Promise<void> {
        return new Promise((resolve) => {
            this.app.listen(CONFIG.PORT, () => {
                console.log(`Server is running on ${CONFIG.SERVER_URL}`);
                resolve();
            });
        });
    }
}
