import { Types } from "mongoose";
import { z } from "zod";

export const subjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    gradeLevel: z.string(),
    category: z.string().optional(),
});

export const bookingSchema = z.object({
    id: z.string(),
    tutorId: z.string(),
    date: z.date(),
    duration: z.number(),
    price: z.number(),
    status: z.enum(["pending", "completed", "canceled"]),
});

export const reviewSchema = z.object({
    id: z.string(),
    tutorId: z.string(),
    comment: z.string(),
    rating: z.number().min(0).max(5),
    timestamp: z.date(),
});

export const registerStudentSchema = z.object({
    user: z.instanceof(Types.ObjectId),
    name: z.string(),
    email: z.string().email(),
    bio: z.string().optional(),
    gradeLevel: z.string().optional(),
    subjectsOfInterest: z.array(subjectSchema).optional(),
    bookingHistory: z.array(bookingSchema).optional(),
    reviewsGiven: z.array(reviewSchema).optional(),
    profileUrl: z
        .string()
        .regex(
            /^(http(s)?:\/\/.*\.(?:png|jpg|jpeg))$/,
            "Invalid photo URL format. Must be a valid image URL."
        ),
});

export const StudentValidations = {
    registerStudentSchema,
};
