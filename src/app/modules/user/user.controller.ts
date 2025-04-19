import { Request, Response } from "express";
import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.registerUser(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User registration completed successfully!",
        data: result,
    });
});

export const UserController = {
    registerUser,
};
