
import { SecretTokenDTO } from "../../dtos/user.dto";

import { TokenService } from "../../../domain/services/token.service";
import { ForbiddenError } from "../../errors/application-error";


export class RefreshAccessTokenUseCase {

    constructor(
        private readonly tokenService: TokenService,

        private readonly secretAccessToken: SecretTokenDTO,
        private readonly secretRefreshToken: SecretTokenDTO
    ) { }

    execute = async (refreshToken: string): Promise<string> => {

        const { userId } = await this.tokenService.verify(refreshToken, this.secretRefreshToken.token) as { userId: string }

        if (!userId) {
            throw new ForbiddenError()
        }

        return await this.tokenService.generate({ userId }, this.secretAccessToken.token, this.secretAccessToken.age);
    }
}
