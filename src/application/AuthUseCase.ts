// adapter

import { IAuthRepository } from "../domain/interfaces/IAuthRepository"


// use repository as type from infrastructure layer

export class AuthUseCase {
    constructor(private readonly authRepository: IAuthRepository) { }

    async checkAuth(): Promise<string> {
        const response = await this.authRepository.checkAuth()
        return response
    }

    async register(): Promise<string> {
        const response = await this.authRepository.register()
        return response
    }

    async login(): Promise<string> {
        const response = await this.authRepository.login()
        return response
    }

    async logout(): Promise<string> {
        const response = await this.authRepository.logout()
        return response
    }

    async verifyEmail(): Promise<string> {
        const response = await this.authRepository.verifyEmail()
        return response
    }

    async resendVerificationCode(): Promise<string> {
        const response = await this.authRepository.resendVerificationCode()
        return response
    }

    async forgotPassword(): Promise<string> {
        const response = await this.authRepository.forgotPassword()
        return response
    }

    async resetPassword(): Promise<string> {
        const response = await this.authRepository.resetPassword()
        return response
    }
}
