import { User } from "../entity/user.entity";

export interface UserRepository {
    create(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByVerificationToken(verificationToken: string): Promise<User | null>;
    update(userId: string, userData: Partial<User>): Promise<void>;
    delete(id: string): Promise<void>;
}