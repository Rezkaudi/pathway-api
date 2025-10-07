
import { Request, Response } from "express"
import {
    LoginUseCase,
    RegisterUseCase,
    VerifyEmailUseCase,
    ResetPasswordUseCase,
    ForgotPasswordUseCase,
    RefreshAccessTokenUseCase,
    UpdatePasswordUseCase,
    ResendVerificationUseCase
} from "../../application/use-cases/auth";

import { Messages, StatusCodes } from "../config/constant.config";

import { LoginDTO, RegisterDTO, ResetPasswordDTO, TokenDTO, UpdatePasswordDTO } from "../../application/dtos/user.dto";

import { ForbiddenError } from "../../application/errors/application-error";
import { ApplicationResponse } from "../../application/response/application-resposne";

import { clearTokensCookie, setTokensCookie, getRefreshToken } from "../config/cookie.config";


export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly registerUseCase: RegisterUseCase,
        private readonly verifyEmailUseCase: VerifyEmailUseCase,
        private readonly resetPasswordUseCase: ResetPasswordUseCase,
        private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
        private readonly refreshAccessTokenUseCase: RefreshAccessTokenUseCase,
        private readonly updatePasswordUseCase: UpdatePasswordUseCase,
        private readonly resendVerificationUseCase: ResendVerificationUseCase,
        private readonly frontEndUrl: string,
    ) { }

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, firstName, lastName, password } = req.body;

            const registerData: RegisterDTO = {
                email,
                firstName,
                lastName,
                password
            }

            await this.registerUseCase.execute(registerData);

            return new ApplicationResponse(res, {
                statusCode: StatusCodes.CREATED,
                success: true,
                data: {},
                message: Messages.REGISTER_SUCCESS
            }).send()

        } catch (error) {
            throw error
        }
    };

    login = async (req: Request, res: Response): Promise<void> => {

        try {
            const { email, password } = req.body;

            const loginData: LoginDTO = {
                email,
                password
            }

            const { accessToken, refreshToken } = await this.loginUseCase.execute(loginData);

            setTokensCookie(res, accessToken, refreshToken)

            return new ApplicationResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                data: {},
                message: Messages.LOGIN_SUCCESS
            }).send()

        } catch (error) {
            throw error
        }
    };

    logout = async (req: Request, res: Response): Promise<void> => {

        try {
            clearTokensCookie(res)

            return new ApplicationResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                data: {},
                message: Messages.LOGOUT_SUCCESS
            }).send()

        } catch (error) {
            throw error
        }
    };

    verifyEmail = async (req: Request, res: Response): Promise<void> => {
        try {
            const { verificationToken } = req.query;
            const { accessToken, refreshToken } = await this.verifyEmailUseCase.execute(verificationToken as string);

            setTokensCookie(res, accessToken, refreshToken)

            res.status(200).redirect(`${this.frontEndUrl}/profile`);

        } catch (error) {
            throw error
        }
    };

    resetPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { newPassword, resetPasswordToken } = req.body;

            await this.resetPasswordUseCase.execute({ resetPasswordToken, newPassword } as ResetPasswordDTO);

            return new ApplicationResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                data: {},
                message: Messages.RESET_PASSWORD_SUCCESS
            }).send()

        } catch (error) {
            throw error
        }
    };

    forgotPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body;

            await this.forgotPasswordUseCase.execute(email);

            return new ApplicationResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                data: {},
                message: Messages.FORGOT_PASSWORD_SUCCESS
            }).send()

        } catch (error) {
            throw error
        }
    };

    refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
        try {
            const refreshToken = getRefreshToken(req);

            if (!refreshToken) {
                throw new ForbiddenError()
            }
            const newAccessToken = await this.refreshAccessTokenUseCase.execute(refreshToken);

            setTokensCookie(res, newAccessToken, refreshToken)

            return new ApplicationResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                data: {},
                message: Messages.REFRESH_TOKEN_SUCCESS
            }).send()

        } catch (error) {
            throw new ForbiddenError((error as any).message)
        }
    }

    checkAuth = async (req: Request, res: Response): Promise<void> => {
        return new ApplicationResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            data: { isAuthenticated: !!(req as any).user },
            message: ""
        }).send()
    };

    updatePassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { currentPassword, newPassword } = req.body;

            const updatePasswordData: UpdatePasswordDTO = {
                userId: req.user._id,
                currentPassword,
                newPassword
            }

            await this.updatePasswordUseCase.execute(updatePasswordData);

            return new ApplicationResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                data: {},
                message: "Password updated successfully"
            }).send()

        } catch (error) {
            throw error
        }
    };

    resendVerification = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body;

            await this.resendVerificationUseCase.execute(email);

            return new ApplicationResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                data: {},
                message: Messages.RESEND_VERIFICATION_SUCCESS
            }).send()


        } catch (error) {
            throw error
        }
    };
}




