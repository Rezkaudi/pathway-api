import express from "express"

import { MongoUserRepository } from "../../infrastructure/repository/mongo-user.repository"

import { AuthUseCase } from "../../application/use-cases/auth.usecase"
import { AuthController } from "../controllers/auth.controllers"
import { forgotPasswordValidator, loginValidator, resendVerificationCodeValidator, resetPasswordValidator, registerValidator, verifyEmailValidator } from "../validators/auth.validators"
import { NodemailerGmailService } from "../../infrastructure/srevices/nodemailer-gmail.service"
import { BcryptPasswordHasher } from "../../infrastructure/srevices/bcrypt-password-hasher"
import { JwtTokenService } from "../../infrastructure/srevices/jwt-token.service"
import { CryptoRandomStringGenerator } from "../../infrastructure/srevices/crypto-random-string-generator"

import { CONFIG } from "../config/env"
import { authMiddleware } from "../middleware/auth.middleware"

const authRoutes = express.Router()

const tokenService = new JwtTokenService()
const mongoAuthRepository = new MongoUserRepository()
const randomStringGenerator = new CryptoRandomStringGenerator()
const encryptionService = new BcryptPasswordHasher(CONFIG.SALT_ROUNDS_BCRYPT)
const emailService = new NodemailerGmailService(CONFIG.GMAIL_USER!, CONFIG.GMAIL_PASS!)


const authUseCase = new AuthUseCase(mongoAuthRepository, emailService, encryptionService, tokenService, randomStringGenerator)

const authController = new AuthController(authUseCase)

authRoutes.get("/check-auth", authMiddleware(tokenService, mongoAuthRepository), authController.checkAuth.bind(authController))
authRoutes.post("/logout", authController.logout.bind(authController))
authRoutes.post("/login", loginValidator, authController.login.bind(authController));
authRoutes.post("/register", registerValidator, authController.register.bind(authController));
authRoutes.post("/verify-email", verifyEmailValidator, authController.verifyEmail.bind(authController))
authRoutes.post("/reset-password", resetPasswordValidator, authController.resetPassword.bind(authController))
authRoutes.post("/forgot-password", forgotPasswordValidator, authController.forgotPassword.bind(authController))
authRoutes.post("/resend-code", resendVerificationCodeValidator, authController.resendVerificationCode.bind(authController))


export default authRoutes;