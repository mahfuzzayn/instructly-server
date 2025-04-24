import { Request, Response } from "express";
import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import { IImageFile } from "../../interface/IImageFile";
import { IJwtPayload } from "../auth/auth.interface";

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.registerUserIntoDB(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User registration completed successfully!",
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

export const UserController = {
    registerUser,
    updateStudentProfile,
    updateTutorProfile,
};
