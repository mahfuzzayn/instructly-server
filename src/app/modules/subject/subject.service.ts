import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import { ISubject, SubjectStatus } from "./subject.interface";
import Subject from "./subject.model";
import mongoose from "mongoose";
import Tutor from "../tutor/tutor.model";
import { IJwtPayload } from "../auth/auth.interface";
import QueryBuilder from "../../builder/QueryBuilder";

const createSubjectIntoDB = async (payload: ISubject) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const tutor = await Tutor.findById(payload?.tutor).session(session);

        if (!tutor) {
            throw new AppError(StatusCodes.NOT_FOUND, "Tutor not found!");
        }

        const existingSubject = await Subject.findOne({
            tutor: payload.tutor,
            name: payload.name,
        }).session(session);

        if (existingSubject) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                "Subject already exists!"
            );
        }

        const subjectCreated = new Subject(payload);
        await subjectCreated.save({ session });

        tutor.subjects.push(subjectCreated._id);
        await tutor.save({ session });

        await session.commitTransaction();

        return subjectCreated;
    } catch (error) {
        await session.abortTransaction();
        // console.error("Error during subject creation:", error);

        throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error as any);
    } finally {
        await session.endSession();
    }
};

const getSingleSubjectFromDB = async (id: string) => {
    const subject = await Subject.findById(id);

    if (!subject) {
        throw new AppError(StatusCodes.NOT_FOUND, "Subject not found!");
    }

    if (subject.status === SubjectStatus.DISCONTINUED) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "Subject has been discontinued!"
        );
    }

    return subject;
};

const getAllSubjectsFromDB = async (query: Record<string, unknown>) => {
    const subjectsQuery = new QueryBuilder(
        Subject.find({ status: SubjectStatus.ACTIVE }).populate("tutor"),
        query
    );

    const subjects = await subjectsQuery.modelQuery;

    const meta = await subjectsQuery.countTotal();

    if (!subjects) {
        throw new AppError(StatusCodes.NOT_FOUND, "No subjects were found!");
    }

    return {
        meta,
        result: subjects,
    };
};

const getMySubjectsFromDB = async (
    authUser: IJwtPayload,
    query: Record<string, unknown>
) => {
    const tutor = await Tutor.findOne({ user: authUser?.userId });

    if (!tutor) {
        throw new AppError(StatusCodes.NOT_FOUND, "Tutor not found!");
    }

    const subjectsQuery = new QueryBuilder(
        Subject.find({
            tutor: tutor?._id,
            status: SubjectStatus.ACTIVE,
        }).populate("tutor"),
        query
    ).paginate();

    const subjects = await subjectsQuery.modelQuery;

    const meta = await subjectsQuery.countTotal();

    if (!subjects) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "You don't have any subjects!"
        );
    }

    return {
        meta,
        result: subjects,
    };
};

const updateSubjectIntoDB = async (id: string, payload: Partial<ISubject>) => {
    const isSubjectExists = await Subject.findById(id);

    if (!isSubjectExists) {
        throw new AppError(StatusCodes.NOT_FOUND, "Subject not found!");
    }

    const result = await Subject.findByIdAndUpdate(id, payload, {
        new: true,
    });

    return result;
};

const discontinueSubjectFromDB = async (id: string) => {
    const isSubjectExists = await Subject.findById(id);

    if (!isSubjectExists) {
        throw new AppError(StatusCodes.NOT_FOUND, "Subject not found!");
    }

    const result = await Subject.findByIdAndUpdate(
        id,
        {
            status: SubjectStatus.DISCONTINUED,
        },
        {
            new: true,
        }
    );

    return result;
};

export const SubjectServices = {
    createSubjectIntoDB,
    getSingleSubjectFromDB,
    getAllSubjectsFromDB,
    getMySubjectsFromDB,
    updateSubjectIntoDB,
    discontinueSubjectFromDB,
};
