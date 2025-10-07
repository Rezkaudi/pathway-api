
import { Request, Response } from "express"

import { Messages, StatusCodes } from "../config/constant.config";

import {
    GetUserInfoUseCase,
    UpdateUserInfoUseCase,
    DeleteUserAccountUseCase,
} from "../../application/use-cases/user";


import { ApplicationResponse } from "../../application/response/application-resposne";
import { User } from "../../domain/entity/user.entity";

import { clearTokensCookie, setTokensCookie, getRefreshToken } from "../config/cookie.config";

export class UserController {
    constructor(
        private readonly getUserInfoUseCase: GetUserInfoUseCase,
        private readonly updateUserInfoUseCase: UpdateUserInfoUseCase,
        private readonly deleteUserAccountUseCase: DeleteUserAccountUseCase,
    ) { }

    getUserInfo = async (req: Request, res: Response): Promise<void> => {
        try {

            const userId = req.user._id
            const userInfo = await this.getUserInfoUseCase.execute(userId)

            return new ApplicationResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                data: { user: userInfo },
                message: Messages.GET_USER_INFO_SUCCESS
            }).send()

        } catch (error) {
            throw error
        }
    };

    updateUserInfo = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user._id
            const { profileImageUrl, firstName, lastName, biography, email, phoneNumber, degree, university, links } = req.body;

            const updatedUserData: Partial<User> = {
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(biography !== undefined && { biography }),
                ...(email && { email }),
                ...(phoneNumber !== undefined && { phoneNumber }),
                ...(degree !== undefined && { degree }),
                ...(university !== undefined && { university }),
                ...(profileImageUrl !== undefined && { profileImageUrl }),
                ...(links !== undefined && { links: JSON.stringify(links) }),
            };

            const updatedUserInfo = await this.updateUserInfoUseCase.execute(userId, updatedUserData)

            return new ApplicationResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                data: { user: updatedUserInfo },
                message: Messages.UPDATE_USER_INFO_SUCCESS
            }).send()

        } catch (error) {
            throw error
        }
    };

    deleteAccount = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user._id
            await this.deleteUserAccountUseCase.execute(userId)

            clearTokensCookie(res)
            req.user = null

            return new ApplicationResponse(res, {
                statusCode: StatusCodes.OK,
                success: true,
                data: {},
                message: Messages.DELETE_USER_ACCOUNT_SUCCESS
            }).send()

        } catch (error) {
            throw error
        }
    };

}




