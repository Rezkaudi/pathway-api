
import { MailService } from "../../../domain/services/mail.service";
import { UserRepository } from "../../../domain/repository/user.repository"
import { RandomStringGenerator } from "../../../domain/services/random-str-generator.service";

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
            throw new Error("User not found");
        }
        const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now

        const resetToken = this.randomStringGenerator.generate(32);

        await this.userRepository.update(user._id!, {
            verificationToken: resetToken,
            verificationTokenExpiresAt
        });

        // send email
        const resetPasswordUrl = `${this.frontEndUrl}/reset-password?token=${resetToken}`
        const subject = "forgot password"
        const template = `
        <h4>forgot password</h4>
        <a href="${resetPasswordUrl}">verify</a>
        `
        await this.emailService.send(email, subject, template)
    }
}
