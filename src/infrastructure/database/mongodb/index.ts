import mongoose from "mongoose";
import { CONFIG } from "../../../presentation/config/env";

const MONGODB_URI = CONFIG.DEV_MONGODB_URI

export async function connectToDatabase() {
    console.log(`New connection to MongoDB`);

    try {
        console.log("mongo_uri: ", MONGODB_URI);
        const conn = await mongoose.connect(MONGODB_URI!);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error connecting to MongoDB:", error.message);
        } else {
            console.log("Unexpected error:", error);
        }
        process.exit(1);
    }

}


