import { Schema, model } from "mongoose";
import { DaysOfWeek, ITutor } from "./tutor.interface";

const availabilitySchema = {
    day: {
        type: String,
        enum: Object.values(DaysOfWeek),
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

const tutorSchema = new Schema<ITutor>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        bio: { type: String, default: null },
        hourlyRate: { type: Number, default: null },
        earnings: { type: Number, default: null },
        subjects: {
            type: [Schema.Types.ObjectId],
            ref: "Subject",
            default: [],
        },
        availability: { type: [availabilitySchema], default: [] },
        reviews: { type: [Schema.Types.ObjectId], ref: "Review", default: [] },
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
    { timestamps: true }
);

const Tutor = model<ITutor>("Tutor", tutorSchema);

export default Tutor;
