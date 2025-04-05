
import Server from "./presentation/Server";
// import { connectToDatabase } from "./infrastructure/database/mongodb";

async function main() {
    try {
        const server = new Server();

        // await connectToDatabase();
        await server.run();
    } catch (error) {
        console.error("Failed to start the application:", error);
        process.exit(1);
    }
}

main();
