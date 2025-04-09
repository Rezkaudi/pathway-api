
import { AuthResposnseDTO, SecretTokenDTO } from "../../dtos/user.dto";

import { TokenService } from "../../../domain/services/token.service";
import { UserRepository } from "../../../domain/repository/user.repository"


export class VerifyEmailUseCase {

    constructor(
        private readonly tokenService: TokenService,
        private readonly userRepository: UserRepository,

        private readonly secretAccessToken: SecretTokenDTO,
        private readonly secretRefreshToken: SecretTokenDTO,
    ) { }

    execute = async (verificationToken: string): Promise<AuthResposnseDTO> => {

        const user = await this.userRepository.findByVerificationToken(verificationToken);

        if (!user) {
            throw new Error("Invalid or expired token");
        }

        await this.userRepository.update(user._id!, {
            isVerified: true,
            verificationToken: null,
        });

        const accessToken = await this.tokenService.generate({ userId: user._id }, this.secretAccessToken.token, this.secretAccessToken.age);
        const refreshToken = await this.tokenService.generate({ userId: user._id }, this.secretRefreshToken.token, this.secretRefreshToken.age);

        return { accessToken, refreshToken };
    }

}
