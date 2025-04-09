
export default class Database {
    private static instance: Database;
    private isConnected: boolean = false;

    private constructor() { }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async connect(): Promise<void> {
        if (this.isConnected) {
            console.log("postgesSQL already connected.");
            return;
        }

        console.log(`New connection to postgesSQL`);
        try {
            // connection functions

            this.isConnected = true;
        } catch (error) {
            if (error instanceof Error) {
                console.log("Error connecting to postgesSQL:", error.message);
            } else {
                console.log("Unexpected error:", error);
            }
            process.exit(1);
        }
    }
}

