import { Schema, model } from "mongoose";
import { IStudent } from "./student.interface";

const SubjectSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    gradeLevel: { type: String, required: true },
    category: { type: String },
});

const BookingSchema = new Schema({
    id: { type: String, required: true },
    tutorId: { type: String, required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "completed", "canceled"],
        required: true,
    },
});

const ReviewSchema = new Schema({
    id: { type: String, required: true },
    tutorId: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, required: true },
    timestamp: { type: Date, required: true },
});

const StudentSchema = new Schema<IStudent>({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    bio: { type: String, default: null },
    gradeLevel: { type: String, default: null },
    subjectsOfInterest: { type: [SubjectSchema], default: [] },
    bookingHistory: { type: [BookingSchema], default: [] },
    reviewsGiven: { type: [ReviewSchema], default: [] },
    profileUrl: {
        type: String,
        default: null,
        validate: {
            validator: function (v: string) {
                return /^(http(s)?:\/\/.*\.(?:png|jpg|jpeg))/.test(v);
            },
            message: "Invalid photo URL format.",
        },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const Student = model<IStudent>("Student", StudentSchema);
