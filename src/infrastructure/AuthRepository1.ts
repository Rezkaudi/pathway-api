// use repository as type from outer layer

import { IAuthRepository } from "../domain/interfaces/IAuthRepository"

export class AuthRepository1 implements IAuthRepository {

    async checkAuth(): Promise<string> {
        return "checkAuth"
    }

    async register(): Promise<string> {
        return "register"
    }

    async login(): Promise<string> {
        return "login"
    }

    async logout(): Promise<string> {
        return "logout"
    }

    async verifyEmail(): Promise<string> {
        return "verifyEmail"
    }

    async resendVerificationCode(): Promise<string> {
        return "resendVerificationCode"
    }

    async forgotPassword(): Promise<string> {
        return "forgotPassword"
    }

    async resetPassword(): Promise<string> {
        return "resetPassword"
    }
}