
import Server from "./presentation/Server";
import { AppDataSource } from "./infrastructure/database/config/database.config";

async function main() {
    try {
        const server = new Server();
        await AppDataSource.initialize();

        server.init();
        await server.run();

    } catch (error) {
        console.error("Failed to start the application:", error);
        process.exit(1);
    }
}

main();
