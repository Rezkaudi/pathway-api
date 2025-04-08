import { CONFIG } from "../config/env";

import { Request, Response, NextFunction } from 'express';
import { TokenService } from "../../domain/services/token.service";
import { UserRepository } from "../../domain/repository/user.repository";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authMiddleware = (tokenService: TokenService, userRepository: UserRepository) => {

    return async (req: Request, res: Response, next: NextFunction) => {

        const accessToken = req.cookies[CONFIG.ACCESS_TOKEN_COOKIE.name];
        const refreshToken = req.cookies[CONFIG.REFRESH_TOKEN_COOKIE.name];

        if (!refreshToken) {
            console.log("Unauthorized, no refresh token");
            res.status(403).json({ error: "Forbidden" });
        }

        if (!accessToken) {
            console.log("Unauthorized");
            res.status(401).json({ error: "Unauthorized" });
        }

        try {
            const decoded = (await tokenService.verify(
                accessToken,
                CONFIG.JWT_SECRET,
            )) as {
                userId: string;
            };
            const user = await userRepository.findById(decoded.userId);
            if (user) {
                (req as any).user = user;
                next();
            } else {
                res.status(401).json({ error: "User not found" });
            }
        } catch (error) {
            res.status(401).json({
                success: false,
                message: "Authentication failed"
            });
        }
    };
};
