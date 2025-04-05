export interface IAuthRepository {
    checkAuth(): Promise<string>
    register(): Promise<string>
    login(): Promise<string>
    logout(): Promise<string>
    verifyEmail(): Promise<string>
    resendVerificationCode(): Promise<string>
    forgotPassword(): Promise<string>
    resetPassword(): Promise<string>
}