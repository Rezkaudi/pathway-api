import express from "express"


import { MongoAuthRepository } from "../../infrastructure/repository/MongoAuthRepository"
import { SqliteAuthRepository } from "../../infrastructure/repository/SqliteAuthRepository"



import { AuthUseCase } from "../../application/AuthUseCase"
import { AuthController } from "../controllers/AuthControllers"


const authRoutes = express.Router()

// dynamic transaction from outside
const mongoAuthRepository = new MongoAuthRepository()
const sqliteAuthRepository = new SqliteAuthRepository()

const authUseCase = new AuthUseCase(sqliteAuthRepository)
const authController = new AuthController(authUseCase)


authRoutes.get("/login", authController.login.bind(authController))
authRoutes.get("/logout", authController.logout.bind(authController))
authRoutes.get("/register", authController.register.bind(authController))
authRoutes.get("/check-auth", authController.checkAuth.bind(authController))
authRoutes.get("/verify-email", authController.verifyEmail.bind(authController))
authRoutes.get("/reset-password", authController.resetPassword.bind(authController))
authRoutes.get("/forgot-password", authController.forgotPassword.bind(authController))
authRoutes.get("/resend-code", authController.resendVerificationCode.bind(authController))


module.exports = authRoutes
