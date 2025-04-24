import { ISubject } from "./subject.interface";
import Subject from "./subject.model";

const createSubjectIntoDB = async (payload: ISubject) => {
    const result = await Subject.create(payload);

    return result;
};

export const SubjectServices = { createSubjectIntoDB };
