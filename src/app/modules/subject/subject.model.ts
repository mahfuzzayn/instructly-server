import { Schema, model } from "mongoose";
import { GradeLevel, ISubject, SubjectCategory } from "./subject.interface";

const subjectSchema = new Schema<ISubject>(
    {
        tutor: { type: Schema.Types.ObjectId, ref: "Tutor", required: true },
        name: { type: String, required: true },
        gradeLevel: {
            type: String,
            enum: Object.values(GradeLevel),
            required: true,
        },
        category: {
            type: String,
            enum: Object.values(SubjectCategory),
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Subject = model<ISubject>("Subject", subjectSchema);

export default Subject;
