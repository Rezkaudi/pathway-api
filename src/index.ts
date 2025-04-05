
import { startServer } from "./presentation/ApiServer"

async function main() {

    try {
        // await connectToDatabase();
        await startServer();
    } catch (error) {
        console.error("Failed to start the application:", error);
        process.exit(1);
    }
}

main();
