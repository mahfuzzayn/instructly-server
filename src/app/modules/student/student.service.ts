import { IStudent } from "./student.interface";
import { Student } from "./student.model";

const createStudentIntoDB = async (payload: IStudent) => {
    const result = await Student.create(payload);

    return result;
};

export const StudentServices = {
    createStudentIntoDB,
};
