import { z } from "zod";
import { UserRole } from "./user.interface"; // Assume UserRole is properly defined elsewhere

// Subject schema for both student and tutor
const subjectSchema = z.object({
    name: z.string().min(1, "Subject name is required"),
    gradeLevel: z.string().min(1, "Grade level is required"),
    category: z.string().optional(),
});

// Tutor validation schema (for updating, making all fields optional)
const tutorValidation = z.object({
    bio: z.string().min(10, "Bio must be at least 10 characters long").optional(),
    phoneNumber: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
        .optional(),
    subjects: z
        .array(subjectSchema)
        .nonempty("At least one subject is required")
        .optional(),
    hourlyRate: z.number().positive("Hourly rate must be a positive number").optional(),
    role: z.literal(UserRole.TUTOR), // Ensure role is "tutor"
});

// Student validation schema (for updating, making all fields optional)
const studentValidation = z.object({
    gradeLevel: z.string().min(1, "Grade level is required").optional(),
    subjectsOfInterest: z
        .array(subjectSchema)
        .nonempty("At least one subject of interest is required")
        .optional(),
    role: z.literal(UserRole.STUDENT), // Ensure role is "student"
});

// Combined schema using discriminated union
const updateProfileValidationSchema = z.discriminatedUnion("role", [
    tutorValidation,
    studentValidation,
]);

export const UserValidation = {
    updateProfileValidationSchema,
};
