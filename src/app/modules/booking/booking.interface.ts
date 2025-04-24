import { Types } from "mongoose";

export enum IStatus {
    PENDING_APPROVAL = "pending_approval",
    WAITING_FOR_PAYMENT = "waiting_for_payment",
    CONFIRMED = "confirmed",
    CANCELED_BY_TUTOR = "canceled_by_tutor",
    CANCELED_BY_STUDENT = "canceled_by_student",
    COMPLETED = "completed",
}

export interface IBooking {
    _id: Types.ObjectId;
    student: Types.ObjectId;
    tutor: Types.ObjectId;
    subject: Types.ObjectId;
    date: Date;
    duration: number;
    price: number;
    status: IStatus;
    paymentStatus: "pending" | "completed" | "canceled";
    transactionId: string;
    createdAt: Date;
    updatedAt: Date;
}
