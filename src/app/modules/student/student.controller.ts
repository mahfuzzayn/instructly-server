import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StudentServices } from "./student.service";
import { StatusCodes } from "http-status-codes";

const registerStudent = catchAsync(async (req, res) => {
    const result = await StudentServices.createStudentIntoDB(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Student registration completed successfully!",
        data: result,
    });
});

const getAllStudents = catchAsync(async (req, res) => {
    const result = await StudentServices.getAllStudentsFromDB(req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Students retrieved successfully!",
        meta: result.meta,
        data: result.result,
    });
});

const getSingleStudent = catchAsync(async (req, res) => {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Student retrieved successfully!",
        data: result,
    });
});

export const StudentController = {
    registerStudent,
    getAllStudents,
    getSingleStudent,
};
