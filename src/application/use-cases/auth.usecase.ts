
import { UserRepository } from "../../domain/repository/user.repository"
import { MailService } from "../../domain/services/mail.service";
import { EncryptionService } from "../../domain/services/encryption.service";
import { RandomStringGenerator } from "../../domain/services/random-str-generator.service";
import { TokenService } from "../../domain/services/token.service";
import { CONFIG } from "../../presentation/config/env";
import { LoginDTO, AuthResposnseDTO, RegisterDTO } from "../dtos/user.dto";

export class AuthUseCase {

    constructor(
        private readonly userRepository: UserRepository,
        private emailService: MailService,
        private encryptionService: EncryptionService,
        private tokenService: TokenService,
        private randomStringGenerator: RandomStringGenerator,
    ) { }

    register = async (registerData: RegisterDTO): Promise<void> => {

        const existingUser = await this.userRepository.findByEmail(registerData.email);

        if (existingUser) {
            if (!existingUser.isVerified) {
                await this.userRepository.delete(existingUser._id!)
            }
            else {
                throw new Error("User already exists");
            }
        }

        const hashedPassword = await this.encryptionService.hash(registerData.password);
        const verificationToken = this.randomStringGenerator.generate(32);
        const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now

        const user = {
            email: registerData.email,
            password: hashedPassword,
            firstName: registerData.firstName,
            lastName: registerData.lastName,
            profileImageUrl: undefined,
            isVerified: true,
            verificationToken,
            verificationTokenExpiresAt,
        }

        await this.userRepository.create(user);

        // send verification email

        const verifyUrl = `${CONFIG.SERVER_URL}/api/auth/verify-email?token=${verificationToken}`
        const subject = "verify your email"
        const template = `
        <h4>verify your email</h4>
        <a href="${verifyUrl}">verify</a>
        `
        await this.emailService.send(registerData.email, subject, template)

    };

    login = async (loginData: LoginDTO): Promise<AuthResposnseDTO> => {
        const user = await this.userRepository.findByEmail(loginData.email);
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await this.encryptionService.compare(loginData.password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        if (!user.isVerified) {
            throw new Error("Please verify your email before logging in");
        }

        const accessToken = await this.tokenService.generate({ userId: user._id }, CONFIG.JWT_SECRET, CONFIG.JWT_EXPIRATION);
        const refreshToken = await this.tokenService.generate({ userId: user._id }, CONFIG.REFRESH_TOKEN_SECRET, CONFIG.REFRESH_TOKEN_EXPIRATION,);

        return { accessToken, refreshToken };
    };

    refreshAccessToken = async (refreshToken: string): Promise<string> => {
        const decoded = (await this.tokenService.verify(refreshToken, CONFIG.REFRESH_TOKEN_SECRET)) as { userId: string } | null;

        if (!decoded || !decoded.userId) {
            throw new Error("Invalid refresh token");
        }

        return await this.tokenService.generate({ userId: decoded.userId }, CONFIG.JWT_SECRET, CONFIG.JWT_EXPIRATION);
    }

    verifyEmail = async (verificationToken: string): Promise<AuthResposnseDTO> => {
        const user = await this.userRepository.findByVerificationToken(verificationToken);

        if (!user) {
            throw new Error("Invalid or expired token");
        }

        await this.userRepository.update(user._id!, {
            isVerified: true,
            verificationToken: null,
        });

        const accessToken = await this.tokenService.generate({ userId: user._id }, CONFIG.JWT_SECRET, CONFIG.JWT_EXPIRATION);
        const refreshToken = await this.tokenService.generate({ userId: user._id }, CONFIG.REFRESH_TOKEN_SECRET, CONFIG.REFRESH_TOKEN_EXPIRATION);

        return { accessToken, refreshToken };
    }

    forgotPassword = async (email: string): Promise<void> => {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new Error("User not found");
        }
        const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now

        const resetToken = this.randomStringGenerator.generate(32);

        await this.userRepository.update(user._id!, {
            verificationToken: resetToken,
            verificationTokenExpiresAt
        });

        // send email
        const resetPasswordUrl = `${CONFIG.FRONT_URL}/reset-password?token=${resetToken}`
        const subject = "forgot password"
        const template = `
        <h4>forgot password</h4>
        <a href="${resetPasswordUrl}">verify</a>
        `
        await this.emailService.send(email, subject, template)
    }

    async resetPassword(verificationToken: string, newPassword: string): Promise<void> {
        const user = await this.userRepository.findByVerificationToken(verificationToken);
        if (!user) {
            throw new Error("Invalid or expired token");
        }

        const hashedNewPassword = await this.encryptionService.hash(newPassword);
        await this.userRepository.update(user._id!, {
            password: hashedNewPassword,
            verificationToken: null,
        });
    }
}
