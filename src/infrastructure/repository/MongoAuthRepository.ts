// use repository as type from outer layer

import { IAuthRepository } from "../../domain/interfaces/IAuthRepository"

export class MongoAuthRepository implements IAuthRepository {

    async checkAuth(): Promise<string> {
        return "From MongoDB - checkAuth"
    }

    async register(): Promise<string> {
        return "From MongoDB - register"
    }

    async login(): Promise<string> {
        return "From MongoDB - login"
    }

    async logout(): Promise<string> {
        return "From MongoDB - logout"
    }

    async verifyEmail(): Promise<string> {
        return "From MongoDB - verifyEmail"
    }

    async resendVerificationCode(): Promise<string> {
        return "From MongoDB - resendVerificationCode"
    }

    async forgotPassword(): Promise<string> {
        return "From MongoDB - forgotPassword"
    }

    async resetPassword(): Promise<string> {
        return "From MongoDB - resetPassword"
    }
}