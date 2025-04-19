import { Types } from "mongoose";

export interface ITutor {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    name: string;
    email: string;
    bio: string;
    phoneNumber?: string;
    subjects: ISubject[];
    hourlyRate: number;
    reviews: IReview[];
    profileUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISubject {
    name: string;
    gradeLevel: string;
    category?: string;
}

export interface IAvailability {
    day: string;
    timeSlots: string[];
}

export interface IReview {
    student: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}
