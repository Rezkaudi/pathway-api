
import { Router } from 'express';

import { AuthController } from "../controllers/auth.controllers"

import {
    loginValidator,
    registerValidator,
    verifyEmailValidator,
    resetPasswordValidator,
    forgotPasswordValidator,
    resendVerificationCodeValidator,
} from "../validators/auth.validators"

const authRoutes = (authController: AuthController): Router => {
    const router = Router()

    router.post("/check-auth", authController.checkAuth.bind(authController))
    router.post("/logout", authController.logout.bind(authController))
    router.post("/login", loginValidator, authController.login.bind(authController));
    router.post("/register", registerValidator, authController.register.bind(authController));
    router.post("/verify-email", verifyEmailValidator, authController.verifyEmail.bind(authController))
    router.post("/reset-password", resetPasswordValidator, authController.resetPassword.bind(authController))
    router.post("/forgot-password", forgotPasswordValidator, authController.forgotPassword.bind(authController))
    router.post("/resend-code", resendVerificationCodeValidator, authController.resendVerificationCode.bind(authController))

    return router;
};

export default authRoutes