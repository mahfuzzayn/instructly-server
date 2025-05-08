import { Types } from "mongoose";

export interface ITutor {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    bio: string;
    hourlyRate: number;
    averageRating: number;
    profileUrl: string;
    location: string;
    earnings: number;
    subjects: Types.ObjectId[];
    availability: IAvailability[];
    bookings: Types.ObjectId[];
    reviews: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IAvailability {
    _id: Types.ObjectId;
    day: DaysOfWeek;
    startTime: string;
    endTime: string;
    totalHours: number;
}

export enum DaysOfWeek {
    Saturday = "Saturday",
    Sunday = "Sunday",
    Monday = "Monday",
    Tuesday = "Tuesday",
    Wednesday = "Wednesday",
    Thursday = "Thursday",
    Friday = "Friday",
}

export interface TutorQuery {
    subject?: string | string[];
    rating?: string;
    minHRate?: string;
    maxHRate?: string;
    availability?: {
        day: string;
        startTime: string;
        endTime: string;
    };
    location?: {
        area?: string;
        district?: string;
    };
}