import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import { IStudent } from "./student.interface";
import { Student } from "./student.model";
import { studentSearchableFields } from "./student.const";
import QueryBuilder from "../../builder/QueryBuilder";

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

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
    const { subjectsOfInterest } = query;

    const filter: Record<string, any> = {};

    if (subjectsOfInterest) {
        const subjectsArray =
            typeof subjectsOfInterest === "string"
                ? subjectsOfInterest?.split(",")
                : subjectsOfInterest;

        filter.subjectsOfInterest = {
            $in: Array.isArray(subjectsArray) ? subjectsArray : [subjectsArray],
        };
    }

    const studentsQuery = new QueryBuilder(
        Student.find(filter).populate(
            "user subjectsOfInterest bookingHistory reviewsGiven"
        ),
        query as any
    )
        .search(studentSearchableFields)
        .sort()
        .paginate()
        .fields();

    const tutors = await studentsQuery.modelQuery.lean();

    const meta = await studentsQuery.countTotal();

    if (!tutors) {
        throw new AppError(StatusCodes.NOT_FOUND, "No tutors were found!");
    }

    return {
        meta,
        result: tutors,
    };
};

const getSingleStudentFromDB = async (studentId: string) => {
    const student = await Student.findById(studentId)
        .populate("user")
        .populate({
            path: "reviews",
            populate: [
                {
                    path: "student",
                    populate: [{ path: "user", select: "name email" }],
                },
                {
                    path: "tutor",
                    populate: [{ path: "user", select: "name email" }],
                },
            ],
        })
        .populate("subjects");

    if (!student) {
        throw new AppError(StatusCodes.NOT_FOUND, "No student were found!");
    }

    return student;
};

export const StudentServices = {
    createStudentIntoDB,
    getAllStudentsFromDB,
    getSingleStudentFromDB,
};
