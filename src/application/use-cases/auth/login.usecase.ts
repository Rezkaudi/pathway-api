import { AuthResposnseDTO, LoginDTO, SecretTokenDTO } from "../../dtos/user.dto";

import { BadRequestError } from "../../errors/application-error";

import { TokenService } from "../../../domain/services/token.service";
import { UserRepository } from "../../../domain/repository/user.repository"
import { EncryptionService } from "../../../domain/services/encryption.service";


export class LoginUseCase {

    constructor(
        private readonly secretAccessToken: SecretTokenDTO,
        private readonly secretRefreshToken: SecretTokenDTO,

        private readonly tokenService: TokenService,
        private readonly userRepository: UserRepository,
        private readonly encryptionService: EncryptionService
    ) { }

    execute = async (loginData: LoginDTO): Promise<AuthResposnseDTO> => {
        const user = await this.userRepository.findByEmail(loginData.email);

        if (!user) {
            throw new BadRequestError("Invalid credentials");
        }

        const isPasswordValid = await this.encryptionService.compare(loginData.password, user.password);

        if (!isPasswordValid) {
            throw new BadRequestError("Invalid credentials");
        }

        if (!user.isVerified) {
            throw new BadRequestError("Please verify your email before logging in");
        }

        const accessToken = await this.tokenService.generate({ userId: user._id }, this.secretAccessToken.token, this.secretAccessToken.age);
        const refreshToken = await this.tokenService.generate({ userId: user._id }, this.secretRefreshToken.token, this.secretRefreshToken.age);

        return { accessToken, refreshToken };
    };
}
