export interface User {
    _id?: string,
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string | null;
    isVerified: boolean;
    resetPasswordToken?: string | null;
    resetPasswordExpiresAt?: Date | null;
    verificationToken?: string | null;
    verificationTokenExpiresAt?: Date | null;
}
