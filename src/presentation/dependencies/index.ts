import { CONFIG } from '../config/env.config';

// Srevices
import { JwtTokenService } from '../../infrastructure/srevices/jwt-token.service';
import { BcryptPasswordHasher } from '../../infrastructure/srevices/bcrypt-password-hasher';
import { IdOrderedGeneratorService } from '../../infrastructure/srevices/id-ordered-generator.service';
import { NodemailerGmailService } from '../../infrastructure/srevices/nodemailer-gmail.service';
import { CryptoRandomStringGenerator } from '../../infrastructure/srevices/crypto-random-string-generator';

// Repositories
import { PostgreSQLUserRepository } from '../../infrastructure/database/repository/postgresql-user.repository';
import { PostgreSQLPathwayRepository } from '../../infrastructure/database/repository/postgresql-pathway.repository';

// Use Cases
import {
    LoginUseCase,
    RegisterUseCase,
    VerifyEmailUseCase,
    ResetPasswordUseCase,
    ForgotPasswordUseCase,
    UpdatePasswordUseCase,
    RefreshAccessTokenUseCase,
    ResendVerificationUseCase
} from '../../application/use-cases/auth';

import {
    GetUserInfoUseCase,
    UpdateUserInfoUseCase,
    DeleteUserAccountUseCase,
} from '../../application/use-cases/user';

import {
    CreatePathwayUseCase,
    DeletePathwayUseCase,
    UpdatePathwayUseCase,
    GetAllPathwaysUseCase,
    GetPathwayByIdUseCase,
    GetAllUserPathwaysUseCase,
    CreateMockPathwaysUseCase,
    ExportPathwayUseCase
} from '../../application/use-cases/pathway';

// Controllers
import { AuthController } from '../controllers/auth.controllers';
import { RootController } from '../controllers/root.controllers';
import { UserController } from '../controllers/user.controllers';
import { PathwayController } from '../controllers/pathway.controllers';


export const setupDependencies = () => {

    // Repositories
    const userRepository = new PostgreSQLUserRepository();
    const pathwayRepository = new PostgreSQLPathwayRepository();

    // Services
    const tokenService = new JwtTokenService()
    const idOrderedGeneratorService = new IdOrderedGeneratorService(userRepository, pathwayRepository)
    const randomStringGenerator = new CryptoRandomStringGenerator()
    const encryptionService = new BcryptPasswordHasher(CONFIG.SALT_ROUNDS_BCRYPT)
    const emailService = new NodemailerGmailService(CONFIG.GMAIL_USER, CONFIG.GMAIL_PASS)

    // Use Cases

    // 1- Auth
    const loginUseCase = new LoginUseCase(
        CONFIG.JWT_SECRET_ACCESS_TOKEN,
        CONFIG.JWT_SECRET_REFRESH_TOKEN,
        tokenService,
        userRepository,
        encryptionService
    );

    const registerUseCase = new RegisterUseCase(
        CONFIG.SERVER_URL,
        emailService,
        userRepository,
        encryptionService,
        idOrderedGeneratorService,
        randomStringGenerator
    );

    const verifyEmailUseCase = new VerifyEmailUseCase(
        tokenService,
        userRepository,
        CONFIG.JWT_SECRET_ACCESS_TOKEN,
        CONFIG.JWT_SECRET_REFRESH_TOKEN
    );

    const resetPasswordUseCase = new ResetPasswordUseCase(
        encryptionService,
        userRepository
    );


    const forgotPasswordUseCase = new ForgotPasswordUseCase(
        CONFIG.FRONT_URL,
        emailService,
        userRepository,
        randomStringGenerator
    );

    const refreshAccessTokenUseCase = new RefreshAccessTokenUseCase(
        tokenService,
        CONFIG.JWT_SECRET_ACCESS_TOKEN,
        CONFIG.JWT_SECRET_REFRESH_TOKEN,
    );

    const updatePasswordUseCase = new UpdatePasswordUseCase(
        encryptionService,
        userRepository
    );

    const resendVerificationUseCase = new ResendVerificationUseCase(
        CONFIG.SERVER_URL,
        emailService,
        userRepository,
        randomStringGenerator
    );

    // 2- User
    const getUserInfoUseCase = new GetUserInfoUseCase(
        userRepository,
    );

    const updateUserInfoUseCase = new UpdateUserInfoUseCase(
        userRepository,
    );

    const deleteUserAccountUseCase = new DeleteUserAccountUseCase(
        userRepository,
    );

    // 3- Pathway
    const createPathwayUseCase = new CreatePathwayUseCase(
        pathwayRepository,
        idOrderedGeneratorService
    )

    const createMockPathwaysUseCase = new CreateMockPathwaysUseCase(
        pathwayRepository,
        idOrderedGeneratorService
    )

    const deletePathwayUseCase = new DeletePathwayUseCase(
        pathwayRepository
    )

    const getAllPathwaysUseCase = new GetAllPathwaysUseCase(
        pathwayRepository
    );

    const getPathwayByIdUseCase = new GetPathwayByIdUseCase(
        pathwayRepository
    );

    const updatePathwayUseCase = new UpdatePathwayUseCase(
        pathwayRepository
    )

    const getAllUserPathwaysUseCase = new GetAllUserPathwaysUseCase(
        pathwayRepository
    )

    const exportPathwayUseCase = new ExportPathwayUseCase(
        pathwayRepository
    )

    // Controllers
    const authController = new AuthController(
        loginUseCase,
        registerUseCase,
        verifyEmailUseCase,
        resetPasswordUseCase,
        forgotPasswordUseCase,
        refreshAccessTokenUseCase,
        updatePasswordUseCase,
        resendVerificationUseCase,
        CONFIG.FRONT_URL,
    );

    const userController = new UserController(
        getUserInfoUseCase,
        updateUserInfoUseCase,
        deleteUserAccountUseCase
    );

    const pathwayController = new PathwayController(
        createPathwayUseCase,
        deletePathwayUseCase,
        updatePathwayUseCase,
        getAllPathwaysUseCase,
        getPathwayByIdUseCase,
        getAllUserPathwaysUseCase,
        createMockPathwaysUseCase,
        exportPathwayUseCase
    );


    const rootController = new RootController()


    return {
        tokenService,
        userRepository,

        authController,
        rootController,
        userController,
        pathwayController
    };
};