
import { SecretTokenDTO } from "../../dtos/user.dto";

import { TokenService } from "../../../domain/services/token.service";


export class RefreshAccessTokenUseCase {

    constructor(
        private readonly tokenService: TokenService,

        private readonly secretAccessToken: SecretTokenDTO,
        private readonly secretRefreshToken: SecretTokenDTO
    ) { }

    execute = async (refreshToken: string): Promise<string> => {
        const decoded = (await this.tokenService.verify(refreshToken, this.secretRefreshToken.token)) as { userId: string } | null;

        if (!decoded || !decoded.userId) {
            throw new Error("Invalid refresh token");
        }

        return await this.tokenService.generate({ userId: decoded.userId }, this.secretAccessToken.token, this.secretAccessToken.age);
    }
}
