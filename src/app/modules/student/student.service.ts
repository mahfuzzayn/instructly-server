import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import { IStudent } from "./student.interface";
import { Student } from "./student.model";

const createStudentIntoDB = async (payload: IStudent) => {
    const result = await Student.create(payload);

    if (!result) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Failed to create a student."
        );
    }

    return result;
};

export const StudentServices = {
    createStudentIntoDB,
};
