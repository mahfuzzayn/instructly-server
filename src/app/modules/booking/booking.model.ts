import { Schema, model } from "mongoose";
import { IBooking, IStatus } from "./booking.interface";

const bookingSchema = new Schema<IBooking>(
    {
        student: { type: Schema.Types.ObjectId, required: true },
        tutor: { type: Schema.Types.ObjectId, required: true },
        subject: { type: Schema.Types.ObjectId, required: true },
        date: {
            type: Date,
            required: true,
            validate: {
                validator: function (v: Date) {
                    return v > new Date();
                },
                message: "Booking date must be in the future.",
            },
        },
        duration: {
            type: Number,
            required: true,
            min: [30, "Duration must be at least 30 minutes."],
            max: [240, "Duration cannot exceed 4 hours (240 minutes)."],
        },
        price: {
            type: Number,
            required: true,
            validate: {
                validator: function (v: number) {
                    return v >= 0;
                },
                message: "Price must be greater than zero.",
            },
        },
        status: {
            type: String,
            enum: Object.values(IStatus),
            default: IStatus.PENDING_APPROVAL,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "canceled"],
            default: "pending",
        },
        transactionId: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Booking = model<IBooking>("Booking", bookingSchema);

export default Booking;
