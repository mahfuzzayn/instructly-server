import { Types } from "mongoose";

export interface IReview {
    _id: Types.ObjectId;
    student: Types.ObjectId;
    tutor: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}
