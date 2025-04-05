// use repository as type from outer layer

import { IAuthRepository } from "../../domain/interfaces/IAuthRepository"

export class AuthRepository2 implements IAuthRepository {

    async checkAuth(): Promise<string> {
        return "2 checkAuth"
    }

    async register(): Promise<string> {
        return "2 register"
    }

    async login(): Promise<string> {
        return "2 login"
    }

    async logout(): Promise<string> {
        return "2 logout"
    }

    async verifyEmail(): Promise<string> {
        return "2 verifyEmail"
    }

    async resendVerificationCode(): Promise<string> {
        return "2 resendVerificationCode"
    }

    async forgotPassword(): Promise<string> {
        return "2 forgotPassword"
    }

    async resetPassword(): Promise<string> {
        return "2 resetPassword"
    }
}