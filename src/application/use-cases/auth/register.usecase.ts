
import { RegisterDTO } from "../../dtos/user.dto";

import { BadRequestError, ConflictRequestError } from "../../errors/application-error";

import { MailService } from "../../../domain/services/mail.service";
import { UserRepository } from "../../../domain/repository/user.repository"
import { EncryptionService } from "../../../domain/services/encryption.service";
import { RandomStringGenerator } from "../../../domain/services/random-str-generator.service";
import { IdGeneratorService } from "../../../domain/services/id-generator.service";


export class RegisterUseCase {
    private verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    constructor(
        private readonly ServerUrl: string,
        private readonly emailService: MailService,
        private readonly userRepository: UserRepository,
        private readonly encryptionService: EncryptionService,
        private readonly idOrderedGeneratorService: IdGeneratorService,
        private readonly randomStringGenerator: RandomStringGenerator,

    ) { }

    execute = async (registerData: RegisterDTO): Promise<void> => {

        const existingUser = await this.userRepository.findByEmail(registerData.email);

        if (existingUser) {
            if (!existingUser.isVerified) {
                throw new BadRequestError("Please Verify Your Email");
            }
            else {
                throw new ConflictRequestError("User already exists");
            }
        }

        const hashedPassword = await this.encryptionService.hash(registerData.password);
        const verificationToken = this.randomStringGenerator.generate(32);

        const user = {
            _id: `USER_${await this.idOrderedGeneratorService.generateNextIdForUser()}`,
            email: registerData.email,
            password: hashedPassword,
            firstName: registerData.firstName,
            lastName: registerData.lastName,
            verificationToken,
            verificationTokenExpiresAt: this.verificationTokenExpiresAt,
        }

        await this.emailService.verify()
        await this.userRepository.create(user);

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
        await this.emailService.send(registerData.email, subject, template)

    };
}
