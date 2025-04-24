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

export const StudentController = {
    registerStudent,
};
