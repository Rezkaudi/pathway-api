import cors from 'cors';

import { CONFIG } from "./config/env";
import express, { Express } from "express";
import cookieParser from 'cookie-parser';

import { logger } from './middleware/logger.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// routes
import authRoutes from './routes/auth.routes';
import rootRoute from './routes/root.routs';


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
        this.app.use(cookieParser());
        this.app.use(express.static("public"));
        this.app.use(express.urlencoded({ extended: false }));

    }

    private setupRoutes() {
        this.app.use("/", rootRoute);
        this.app.use('/api/auth', authRoutes);
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
