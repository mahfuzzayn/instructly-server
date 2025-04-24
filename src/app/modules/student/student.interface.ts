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

export interface IBooking {
    _id: Types.ObjectId;
    student: Types.ObjectId;
    tutor: Types.ObjectId;
    subject: Types.ObjectId;
    date: Date;
    duration: number;
    price: number;
    status:
        | "pending_approval"
        | "waiting_for_payment"
        | "confirmed"
        | "completed"
        | "canceled_by_tutor"
        | "canceled_by_student"
        | "completed";
    paymentStatus: "pending" | "completed" | "canceled";
    transactionId: string;
    createdAt: Date;
    updatedAt: Date;
}
