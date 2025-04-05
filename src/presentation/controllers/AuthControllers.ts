// use use-case as type from application layer


import { Request, Response } from "express"
import { AuthUseCase } from "../../application/AuthUseCase"


export class AuthController {
    constructor(private readonly authUseCase: AuthUseCase) { }

    async checkAuth(req: Request, res: Response): Promise<void> {
        const response = await this.authUseCase.checkAuth()
        res.status(200).json({ message: response })
    }

    async register(req: Request, res: Response): Promise<void> {
        const response = await this.authUseCase.register()
        res.status(200).json({ message: response })
    }

    async login(req: Request, res: Response): Promise<void> {
        const response = await this.authUseCase.login()
        res.status(200).json({ message: response })

    }

    async logout(req: Request, res: Response): Promise<void> {
        const response = await this.authUseCase.logout()
        res.status(200).json({ message: response })

    }

    async verifyEmail(req: Request, res: Response): Promise<void> {
        const response = await this.authUseCase.verifyEmail()
        res.status(200).json({ message: response })

    }

    async resendVerificationCode(req: Request, res: Response): Promise<void> {
        const response = await this.authUseCase.resendVerificationCode()
        res.status(200).json({ message: response })

    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
        const response = await this.authUseCase.forgotPassword()
        res.status(200).json({ message: response })

    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        const response = await this.authUseCase.resetPassword()
        res.status(200).json({ message: response })

    }
}
