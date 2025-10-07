import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    entities:
        process.env.NODE_ENV === 'development'
            ? [__dirname + '/../entities/*.entity.ts']
            : [__dirname + '/../entities/*.entity.js'],
    migrations:
        process.env.NODE_ENV === 'development'
            ? [__dirname + '/../migrations/*.ts']
            : [__dirname + '/../migrations/*.js'],
    subscribers: [],
    // ssl: { rejectUnauthorized: false },
});
