// use use-case as type from application layer


import { Request, Response } from "express"
import { AuthUseCase } from "../../application/use-cases/auth.usecase"
import { LoginDTO, RegisterDTO, TokenDTO } from "../../application/dtos/user.dto";
import { CONFIG } from "../config/env";


export class AuthController {
    constructor(
        private readonly authUseCase: AuthUseCase

    ) { }

    private setTokenCookie(res: Response, token: TokenDTO, tokenValue: string): void {

        res.cookie(token.name, tokenValue, {
            httpOnly: true,
            secure: CONFIG.NODE_ENV === "production",
            sameSite: "none",
            maxAge: token.age,
        });
    }

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, firstName, lastName, password } = req.body;

            const registerData: RegisterDTO = {
                email,
                firstName,
                lastName,
                password
            }

            console.log(registerData)

            await this.authUseCase.register(registerData);
            res.status(201).json({ message: "User registered successfully. Please check your email for verification." });

        } catch (error) {
            if (error instanceof Error) {
                res.status(400)
                throw new Error(error.message)
                // res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    };

    login = async (req: Request, res: Response): Promise<void> => {

        try {
            const { email, password } = req.body;

            const loginData: LoginDTO = {
                email,
                password
            }

            const { accessToken, refreshToken } = await this.authUseCase.login(loginData);

            this.setTokenCookie(res, CONFIG.ACCESS_TOKEN_COOKIE, accessToken);
            this.setTokenCookie(res, CONFIG.REFRESH_TOKEN_COOKIE, refreshToken);

            res.status(200).json({ message: "Login successful" });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Please verify your email before logging in") {
                    res.status(403).json({ message: error.message });
                } else {
                    res.status(400).json({ message: error.message });
                }
            } else {
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    };

    logout = async (req: Request, res: Response): Promise<void> => {

        try {
            const cookieOptions = {
                httpOnly: true,
                secure: CONFIG.NODE_ENV === "production",
                sameSite: "none" as const
            }

            res.clearCookie(CONFIG.ACCESS_TOKEN_COOKIE.name, cookieOptions);
            res.clearCookie(CONFIG.REFRESH_TOKEN_COOKIE.name, cookieOptions);
            res.status(200).json({ message: "Logged out successfully" });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            }
        }
    };

    verifyEmail = async (req: Request, res: Response): Promise<void> => {
        try {
            const { verificationToken } = req.body;
            const { accessToken, refreshToken } = await this.authUseCase.verifyEmail(verificationToken);

            this.setTokenCookie(res, CONFIG.ACCESS_TOKEN_COOKIE, accessToken);
            this.setTokenCookie(res, CONFIG.REFRESH_TOKEN_COOKIE, refreshToken);

            res.status(200).redirect(`${CONFIG.FRONT_URL}/terms-of-use`);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Invalid or expired verificationToken") {
                    res.status(400).redirect(`${CONFIG.FRONT_URL}`);
                } else {
                    res.status(400).json({ message: error.message });
                }
            } else {
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    };

    resetPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { newPassword, verificationToken } = req.body;
            await this.authUseCase.resetPassword(verificationToken, newPassword);

            res.status(200).json({ message: "Password reset successfully. You can now log in with your new password." });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    };

    forgotPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body;
            await this.authUseCase.forgotPassword(email);
            res.status(200).json({ message: "Password reset email sent. Please check your inbox." });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        }
    };

    resendVerificationCode = async (req: Request, res: Response): Promise<void> => {
        this.forgotPassword(req, res)
    };

    refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
        try {
            const refreshToken = req.cookies[CONFIG.REFRESH_TOKEN_COOKIE.name];
            if (!refreshToken) {
                res.status(400).json({ message: "No refresh token provided" });
            }
            const newAccessToken =
                await this.authUseCase.refreshAccessToken(refreshToken);
            this.setTokenCookie(res, CONFIG.ACCESS_TOKEN_COOKIE, newAccessToken);

            res.status(200).json({ message: "Token refreshed successfully" });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            }
        }
    }

    checkAuth = async (req: Request, res: Response): Promise<void> => {
        res.json({ isAuthenticated: !!(req as any).user })
    };
}




