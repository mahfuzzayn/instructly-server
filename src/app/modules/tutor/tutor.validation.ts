import { Types } from "mongoose";
import { z } from "zod";

const subjectSchema = z.object({
    name: z.string().min(1, "Subject name is required."),
    gradeLevel: z.string().min(1, "Grade level is required."),
    category: z.string().optional(),
});

export const registerTutorValidationSchema = z.object({
    name: z.string().min(1, "Name is required."),
    email: z.string().email("Invalid email address."),
    user: z.instanceof(Types.ObjectId),
    bio: z.string().nullable().optional(),
    phoneNumber: z.string().optional(),
    subjects: z.array(subjectSchema).default([]).optional(),
    hourlyRate: z
        .number()
        .positive("Hourly rate must be a positive number.")
        .nullable()
        .optional(),
    profileUrl: z
        .string()
        .regex(
            /^(http(s)?:\/\/.*\.(?:png|jpg|jpeg))$/,
            "Invalid photo URL format. Must be a valid image URL."
        ),
});

export const TutorValidations = {
    registerTutorValidationSchema,
};
