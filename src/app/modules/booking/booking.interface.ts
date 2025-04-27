import { Types } from "mongoose";
import { DaysOfWeek } from "../tutor/tutor.interface";

export enum IStatus {
    PENDING_APPROVAL = "pending_approval", // Default
    WAITING_FOR_PAYMENT = "waiting_for_payment", // Tutor 1
    CONFIRMED = "confirmed", // System 1
    CANCELED_BY_TUTOR = "canceled_by_tutor", // Tutor 2
    CANCELED_BY_STUDENT = "canceled_by_student", // Student 1
    COMPLETED = "completed", // System 2
}

export interface IBooking {
    _id: Types.ObjectId;
    student: Types.ObjectId;
    tutor: Types.ObjectId;
    date: Date;
    totalHours: number;
    months: number;
    timeSlots: IAvailability[];
    price: number;
    status: IStatus;
    paymentStatus: "pending" | "completed" | "canceled";
    transactionId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAvailability {
    day: DaysOfWeek;
    startTime: string;
    endTime: string;
    totalHours: number;
}
