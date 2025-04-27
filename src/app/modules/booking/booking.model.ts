import { Schema, model } from "mongoose";
import { IBooking, IStatus } from "./booking.interface";

const availabilitySchema = {
    day: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    totalHours: {
        type: Number,
        required: true,
    },
};

const bookingSchema = new Schema<IBooking>(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        tutor: { type: Schema.Types.ObjectId, ref: "Tutor", required: true },
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
        timeSlots: {
            type: [availabilitySchema],
            required: true,
        },
        totalHours: {
            type: Number,
            required: true,
            min: [0, "Duration must be at least 1 minutes."],
        },
        months: {
            type: Number,
            required: true,
            min: [0, "Months must be at least 1."],
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
