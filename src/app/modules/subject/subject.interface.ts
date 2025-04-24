import { Types } from "mongoose";

export enum GradeLevel {
    PRIMARY = "Primary",
    SECONDARY = "Secondary",
    HIGH_SCHOOL = "High School",
    COLLEGE = "College",
    UNIVERSITY = "University",
    OTHER = "Other",
}

export enum SubjectCategory {
    SCIENCE = "Science",
    MATH = "Math",
    LANGUAGE = "Language",
    TECHNOLOGY = "Technology",
    ARTS = "Arts",
    SPORTS = "Sports",
    OTHER = "Other",
}

export interface ISubject {
    _id: Types.ObjectId;
    tutor: Types.ObjectId;
    name: string;
    gradeLevel: GradeLevel;
    category: SubjectCategory;
    createdAt: Date;
    updatedAt: Date;
}
