
import { MailService } from "../../../domain/services/mail.service";
import { UserRepository } from "../../../domain/repository/user.repository"
import { RandomStringGenerator } from "../../../domain/services/random-str-generator.service";
import { BadRequestError } from "../../errors/application-error";

export class ForgotPasswordUseCase {

    constructor(
        private readonly frontEndUrl: string,
        private readonly emailService: MailService,
        private readonly userRepository: UserRepository,
        private readonly randomStringGenerator: RandomStringGenerator,
    ) { }

    execute = async (email: string): Promise<void> => {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new BadRequestError("User not found");
        }

        const resetPasswordTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now
        const resetPasswordToken = this.randomStringGenerator.generate(32);

        await this.userRepository.update(user._id!, {
            resetPasswordToken,
            resetPasswordTokenExpiresAt
        });

        // send email
        const resetPasswordUrl = `${this.frontEndUrl}/reset-password/reset?token=${resetPasswordToken}`
        const subject = "Reset Password Verification"
        const template = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #57369E;">Password Reset Request</h1>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <a href="${resetPasswordUrl}" style="display: inline-block; background-color: #57369E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Reset Password</a>
          <p style="color: #666; margin-top: 20px;">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
        </div>
    `;

        await this.emailService.send(email, subject, template)
    }
}
