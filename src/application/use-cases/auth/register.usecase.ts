
import { RegisterDTO } from "../../dtos/user.dto";

import { MailService } from "../../../domain/services/mail.service";
import { UserRepository } from "../../../domain/repository/user.repository"
import { EncryptionService } from "../../../domain/services/encryption.service";
import { RandomStringGenerator } from "../../../domain/services/random-str-generator.service";


export class RegisterUseCase {

    constructor(
        private readonly frontEndUrl: string,
        private readonly emailService: MailService,
        private readonly userRepository: UserRepository,
        private readonly encryptionService: EncryptionService,
        private readonly randomStringGenerator: RandomStringGenerator,
    ) { }

    execute = async (registerData: RegisterDTO): Promise<void> => {

        const existingUser = await this.userRepository.findByEmail(registerData.email);

        // temporary
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

        const verifyUrl = `${this.frontEndUrl}/api/auth/verify-email?token=${verificationToken}`
        const subject = "verify your email"
        const template = `
        <h4>verify your email</h4>
        <a href="${verifyUrl}">verify</a>
        `
        await this.emailService.send(registerData.email, subject, template)

    };
}
