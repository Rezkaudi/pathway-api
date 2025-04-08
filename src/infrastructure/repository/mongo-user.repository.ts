// use repository as type from outer layer

import { User } from "../../domain/entity/user"
import { UserRepository } from "../../domain/repository/user.repository"
import { UserModel } from "../database/mongodb/models/user.model";

export class MongoUserRepository implements UserRepository {

    create = async (user: User): Promise<User> => {
        const newUser = new UserModel(user);
        const savedUser = await newUser.save();

        return savedUser;
    }

    findById = async (id: string): Promise<User | null> => {
        return await UserModel.findOne({ _id: id }).exec()
    }

    findByEmail = async (email: string): Promise<User | null> => {
        return await UserModel.findOne({ email }).exec()
    }

    findByVerificationToken = async (verificationToken: string): Promise<User | null> => {
        return await UserModel.findOne({ verificationToken }).exec()
    }

    update = async (userId: string, userData: Partial<User>): Promise<void> => {
        await UserModel.findByIdAndUpdate(userId, { $set: userData }).exec();
    }

    delete = async (id: string): Promise<void> => {
        await UserModel.findByIdAndDelete(id).exec();
    }

}