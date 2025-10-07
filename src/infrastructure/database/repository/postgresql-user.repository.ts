import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { AppDataSource } from '../config/database.config';


import { User } from "../../../domain/entity/user.entity"
import { UserRepository } from "../../../domain/repository/user.repository"



export class PostgreSQLUserRepository implements UserRepository {

    private repository: Repository<UserEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(UserEntity);
    }


    create = async (user: User): Promise<User> => {
        const userEntity = this.toEntity(user);
        const savedEntity = await this.repository.save(user);
        return this.toDomain(savedEntity);
    };

    findById = async (id: string): Promise<User | null> => {
        const entity = await this.repository.findOne({
            where: { _id: id }
        });
        return entity ? this.toDomain(entity) : null;
    };

    findByEmail = async (email: string): Promise<User | null> => {
        const entity = await this.repository.findOne({
            where: { email }
        });
        return entity ? this.toDomain(entity) : null;
    };

    findByVerificationToken = async (verificationToken: string): Promise<User | null> => {
        const entity = await this.repository.findOne({
            where: { verificationToken }
        });
        return entity ? this.toDomain(entity) : null;
    };

    findByResetPasswordToken = async (resetPasswordToken: string): Promise<User | null> => {
        const entity = await this.repository.findOne({
            where: { resetPasswordToken }
        });
        return entity ? this.toDomain(entity) : null;
    };

    update = async (userId: string, userData: Partial<User>): Promise<User | null> => {
        const entity = await this.repository.findOne({
            where: { _id: userId }
        });

        if (!entity) return null;

        // Update the entity fields
        Object.assign(entity, userData);

        const updatedEntity = await this.repository.save(entity);
        return this.toDomain(updatedEntity);
    };

    delete = async (id: string): Promise<void> => {
        await this.repository.delete(id);
    };

    async getAllIds(): Promise<string[]> {
        const entities = await this.repository.find({ select: ['_id'] });
        return entities.map(e => e._id);
    }

    // Convert Domain User to UserEntity
    private toEntity(domain: User): UserEntity {
        const entity = new UserEntity();
        entity._id = domain._id;
        entity.email = domain.email;
        entity.password = domain.password;
        entity.firstName = domain.firstName;
        entity.lastName = domain.lastName;
        entity.profileImageUrl = domain.profileImageUrl;
        entity.isVerified = domain.isVerified;
        entity.verificationToken = domain.verificationToken;
        entity.verificationTokenExpiresAt = domain.verificationTokenExpiresAt;
        entity.resetPasswordToken = domain.resetPasswordToken;
        entity.resetPasswordTokenExpiresAt = domain.resetPasswordTokenExpiresAt;
        entity.biography = domain.biography;
        entity.phoneNumber = domain.phoneNumber;
        entity.degree = domain.degree;
        entity.university = domain.university;
        entity.links = domain.links;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        return entity;
    }

    // Convert UserEntity to Domain User
    private toDomain(entity: UserEntity): User {
        return {
            _id: entity._id,
            email: entity.email,
            password: entity.password,
            firstName: entity.firstName,
            lastName: entity.lastName,
            profileImageUrl: entity.profileImageUrl,
            isVerified: entity.isVerified,
            verificationToken: entity.verificationToken,
            verificationTokenExpiresAt: entity.verificationTokenExpiresAt,
            resetPasswordToken: entity.resetPasswordToken,
            resetPasswordTokenExpiresAt: entity.resetPasswordTokenExpiresAt,
            biography: entity.biography,
            phoneNumber: entity.phoneNumber,
            degree: entity.degree,
            university: entity.university,
            links: entity.links,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }
}