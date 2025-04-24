import { Types } from "mongoose";

export interface IStudent {
    _id: Types.ObjectId;
    user: Types.ObjectId
    bio: string;
    gradeLevel: string;
    subjectsOfInterest: Types.ObjectId[];
    bookingHistory: Types.ObjectId[];
    reviewsGiven: Types.ObjectId[];
    profileUrl: string;
    createdAt: Date;
    updatedAt: Date;
}