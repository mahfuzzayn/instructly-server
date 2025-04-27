import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { SubjectServices } from "./subject.service";
import { Request, Response } from "express";
import { IJwtPayload } from "../auth/auth.interface";

const createSubject = catchAsync(async (req: Request, res: Response) => {
    const result = await SubjectServices.createSubjectIntoDB(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Subject created successfully!",
        data: result,
    });
});

const getSingleSubject = catchAsync(async (req: Request, res: Response) => {
    const { subjectId } = req.params;
    const result = await SubjectServices.getSingleSubjectFromDB(subjectId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Subject retrieved successfully!",
        data: result,
    });
});

const getAllSubjects = catchAsync(async (req: Request, res: Response) => {
    const result = await SubjectServices.getAllSubjectsFromDB();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Subjects retrieved successfully!",
        data: result,
    });
});

const getMySubjects = catchAsync(async (req: Request, res: Response) => {
    const result = await SubjectServices.getMySubjectsFromDB(
        req.user as IJwtPayload
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Subjects retrieved successfully!",
        data: result,
    });
});

const updateSubject = catchAsync(async (req: Request, res: Response) => {
    const { subjectId } = req.params;
    const result = await SubjectServices.updateSubjectIntoDB(
        subjectId,
        req.body
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Subject updated successfully!",
        data: result,
    });
});

const discontinueSubject = catchAsync(async (req: Request, res: Response) => {
    const { subjectId } = req.params;
    const result = await SubjectServices.discontinueSubjectFromDB(subjectId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Subject status changed to discontinued successfully!",
        data: result,
    });
});

export const SubjectController = {
    createSubject,
    getSingleSubject,
    getAllSubjects,
    getMySubjects,
    updateSubject,
    discontinueSubject,
};
