

import { BadRequestError } from "../../errors/application-error";

import { MailService } from "../../../domain/services/mail.service";
import { UserRepository } from "../../../domain/repository/user.repository"
import { RandomStringGenerator } from "../../../domain/services/random-str-generator.service";


export class ResendVerificationUseCase {
    private verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    constructor(
        private readonly ServerUrl: string,
        private readonly emailService: MailService,
        private readonly userRepository: UserRepository,
        private readonly randomStringGenerator: RandomStringGenerator,

    ) { }

    execute = async (email: string): Promise<void> => {

        const existingUser = await this.userRepository.findByEmail(email);

        if (!existingUser) {
            throw new BadRequestError("User Not Found");
        }

        if (existingUser.isVerified) {
            throw new BadRequestError("Email is already verified. Please Login");
        }

        const verificationToken = this.randomStringGenerator.generate(32);

        const updatedUser = {
            verificationToken,
            verificationTokenExpiresAt: this.verificationTokenExpiresAt,
        }

        await this.userRepository.update(existingUser._id!, updatedUser);

        // send verification email
        const verifyUrl = `${this.ServerUrl}/api/auth/verify-email?verificationToken=${verificationToken}`
        const subject = "Verify Your Email";
        const template = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #57369E;">Please Verify Your Email</h1>
          <p>Thank you for joining us! Please this verification link below to continue your registration:</p>
          <a href="${verifyUrl}" style="display: inline-block; background-color: #57369E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Verify Email</a>
        </div>
        `;

        await this.emailService.send(email, subject, template)

    };
}
