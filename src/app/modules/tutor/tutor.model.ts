import { Schema, model, Document, Types, Mongoose } from "mongoose";
import { IReview, ISubject, ITutor } from "./tutor.interface";

const subjectSchema = new Schema<ISubject>({
    name: { type: String, required: true },
    gradeLevel: { type: String, required: true },
    category: { type: String },
});

const tutorSchema = new Schema<ITutor>(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        bio: { type: String, default: null },
        phoneNumber: { type: String },
        subjects: { type: [subjectSchema], default: [] },
        hourlyRate: { type: Number, default: null },
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
    },
    { timestamps: true }
);

const Tutor = model<ITutor>("Tutor", tutorSchema);

export default Tutor;
