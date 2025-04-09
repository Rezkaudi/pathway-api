// import {
//     LoginUseCase,
//     RegisterUseCase,
//     VerifyEmailUseCase,
//     ResetPasswordUseCase,
//     ForgotPasswordUseCase,
//     RefreshAccessTokenUseCase,
// } from '../../application/use-cases/auth';



// export const AuthUseCasesDependencies = ({
//     secretAccessToken,
//     secretRefreshToken,
//     tokenService,
//     userRepository,
//     encryptionService,
//     frontEndUrl,
//     emailService,
//     randomStringGenerator
// }) => {


//     const loginUseCase = new LoginUseCase(
//         secretAccessToken,
//         secretRefreshToken,
//         tokenService,
//         userRepository,
//         encryptionService
//     );

//     const registerUseCase = new RegisterUseCase(
//         frontEndUrl,
//         emailService,
//         userRepository,
//         encryptionService,
//         randomStringGenerator
//     );

//     const verifyEmailUseCase = new VerifyEmailUseCase(
//         tokenService,
//         userRepository,
//         secretAccessToken,
//         secretRefreshToken
//     );

//     const resetPasswordUseCase = new ResetPasswordUseCase(
//         encryptionService,
//         userRepository
//     );


//     const forgotPasswordUseCase = new ForgotPasswordUseCase(
//         frontEndUrl,
//         emailService,
//         userRepository,
//         randomStringGenerator
//     );

//     const refreshAccessTokenUseCase = new RefreshAccessTokenUseCase(
//         tokenService,
//         secretAccessToken,
//         secretRefreshToken,
//     );

//     return {
//         loginUseCase,
//         registerUseCase,
//         verifyEmailUseCase,
//         resetPasswordUseCase,
//         forgotPasswordUseCase,
//         refreshAccessTokenUseCase
//     }
// }