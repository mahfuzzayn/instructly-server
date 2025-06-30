import { Request, Response } from "express";
import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import { IImageFile } from "../../interface/IImageFile";
import { IJwtPayload } from "../auth/auth.interface";
import config from "../../config";

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.registerUserIntoDB(req.body);

    const { refreshToken, accessToken } = result;

    res.cookie("refreshToken", refreshToken, {
        secure: config.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User registration completed successfully!",
        data: {
            accessToken,
        },
    });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.getMeFromDB(req.user as IJwtPayload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User information retrieved successfully!",
        data: result,
    });
});

const updateStudentProfile = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.updateStudentProfileIntoDB(
        req.file as IImageFile,
        req.body,
        req.user as IJwtPayload
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Student profile has been updated successfully!",
        data: result,
    });
});

const updateTutorProfile = catchAsync(async (req: Request, res: Response) => {
    const { tutorId } = req.params;
    const result = await UserServices.updateTutorProfileIntoDB(
        req.file as IImageFile,
        req.body,
        req.user as IJwtPayload
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Tutor profile has been updated successfully!",
        data: result,
    });
});

const updateAdminProfile = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.updateAdminProfileIntoDB(
        req.file as IImageFile,
        req.body,
        req.user as IJwtPayload
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Admin profile has been updated successfully!",
        data: result,
    });
});

// Admin Options
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.getAllUsersFromDB(
        req.user as IJwtPayload
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Users retrieved successfully!",
        data: result,
    });
});

const updateUserByAdmin = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const result = await UserServices.updateUserByAdminIntoDB(
        req.user as IJwtPayload,
        userId,
        req.body
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User updated successfully!",
        data: result,
    });
});

export const UserController = {
    registerUser,
    getMe,
    updateStudentProfile,
    updateTutorProfile,
    updateAdminProfile,

    // Admin Options
    getAllUsers,
    updateUserByAdmin,
};
