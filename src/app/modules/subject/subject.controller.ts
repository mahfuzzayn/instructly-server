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

const deleteSubject = catchAsync(async (req: Request, res: Response) => {
    const { subjectId } = req.params;
    const result = await SubjectServices.deleteSubjectFromDB(subjectId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Subject deleted successfully!",
        data: result,
    });
});

export const SubjectController = {
    createSubject,
    getSingleSubject,
    getAllSubjects,
    updateSubject,
    deleteSubject,
};
