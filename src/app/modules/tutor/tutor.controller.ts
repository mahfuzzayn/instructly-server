import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TutorServices } from "./tutor.service";

const registerTutor = catchAsync(async (req, res) => {
    const result = await TutorServices.registerTutorIntoDB(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Tutor registration completed successfully!",
        data: result,
    });
});

const getAllTutors = catchAsync(async (req, res) => {
    const result = await TutorServices.getAllTutorsFromDB(req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Tutors retrieved successfully!",
        meta: result.meta,
        data: result.result,
    });
});

const getSingleTutor = catchAsync(async (req, res) => {
    const { tutorId } = req.params;
    const result = await TutorServices.getSingleTutorFromDB(tutorId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Tutor retrieved successfully!",
        data: result,
    });
});

export const TutorController = {
    registerTutor,
    getAllTutors,
    getSingleTutor,
};
