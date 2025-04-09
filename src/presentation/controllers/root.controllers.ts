
import { Request, Response } from "express"
import path from "path";

export class RootController {
    constructor() { }

    htmlHomePage = async (req: Request, res: Response): Promise<void> => {
        res.sendFile(path.join(__dirname, "..", "..", "..", "public", "index.html"));
    };
}
