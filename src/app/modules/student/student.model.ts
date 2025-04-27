import { Schema, model } from "mongoose";
import { IStudent } from "./student.interface";

const StudentSchema = new Schema<IStudent>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        bio: { type: String, default: null },
        gradeLevel: { type: String, default: null },
        subjectsOfInterest: {
            type: [Schema.Types.ObjectId],
            ref: "Subject",
            default: [],
        },
        bookingHistory: {
            type: [Schema.Types.ObjectId],
            ref: "Booking",
            default: [],
        },
        reviewsGiven: {
            type: [Schema.Types.ObjectId],
            ref: "Review",
            default: [],
        },
        profileUrl: {
            type: String,
            default: null,
            validate: {
                validator: function (v: string) {
                    if (!v) return true;
                    return /^(http(s)?:\/\/.*\.(?:png|jpg|jpeg))/.test(v);
                },
                message: "Invalid photo URL format.",
            },
        },
    },
    {
        timestamps: true,
    }
);

export const Student = model<IStudent>("Student", StudentSchema);
