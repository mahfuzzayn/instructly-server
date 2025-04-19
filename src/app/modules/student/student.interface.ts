import { Types } from "mongoose";

export interface IStudent {
    _id: Types.ObjectId;
    name: string;
    email: string;
    bio?: string;
    gradeLevel: string;
    subjectsOfInterest: ISubject[];
    bookingHistory: IBooking[];
    reviewsGiven: IReview[];
    profileUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISubject {
    id: string;
    name: string;
    gradeLevel: string;
    category?: string;
}

export interface IBooking {
    id: string;
    tutorId: string;
    date: Date;
    duration: number;
    price: number;
    status: "pending" | "completed" | "canceled";
}

export interface IReview {
    id: string;
    tutorId: string;
    comment: string;
    rating: number;
    timestamp: Date;
}
