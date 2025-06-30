import { Types } from "mongoose";

export interface IAdmin {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    bio: string;
    profileUrl: string;
    createdAt: Date;
    updatedAt: Date;
}
