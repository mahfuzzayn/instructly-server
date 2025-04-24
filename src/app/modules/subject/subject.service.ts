import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import { ISubject } from "./subject.interface";
import Subject from "./subject.model";

const createSubjectIntoDB = async (payload: ISubject) => {
    const result = await Subject.create(payload);

    return result;
};

const getSingleSubjectFromDB = async (id: string) => {
    const result = await Subject.findById(id);

    return result;
};

const getAllSubjectsFromDB = async () => {
    const result = await Subject.find();

    return result;
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

const deleteSubjectFromDB = async (id: string) => {
    const isSubjectExists = await Subject.findById(id);

    if (!isSubjectExists) {
        throw new AppError(StatusCodes.NOT_FOUND, "Subject not found!");
    }

    const result = await Subject.findByIdAndDelete(id);

    return result;
};

export const SubjectServices = {
    createSubjectIntoDB,
    getSingleSubjectFromDB,
    getAllSubjectsFromDB,
    updateSubjectIntoDB,
    deleteSubjectFromDB,
};
