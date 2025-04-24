import { Types } from "mongoose";

export interface ITutor {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    bio: string;
    hourlyRate: number;
    profileUrl: string;
    earnings: number;
    subjects: Types.ObjectId[];
    availability: IAvailability[];
    reviews: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IAvailability {
    day:
        | "Saturday"
        | "Sunday"
        | "Monday"
        | "Tuesday"
        | "Wednesday"
        | "Thursday"
        | "Friday";
    startTime: string;
    endTime: string;
}