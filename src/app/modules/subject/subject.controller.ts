import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { SubjectServices } from "./subject.service";
import { Request, Response } from "express";

const createSubject = catchAsync(async (req: Request, res: Response) => {
    const result = await SubjectServices.createSubjectIntoDB(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User registration completed successfully!",
        data: result,
    });
});

export const SubjectController = {
    createSubject,
};
