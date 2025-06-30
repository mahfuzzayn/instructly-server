import { z } from "zod";
import { UserRole } from "./user.interface";

const registerUserValidationSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string(),
        name: z.string(),
        role: z
            .enum([UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN])
            .default(UserRole.STUDENT),
    }),
});

const updateStudentProfileValidationSchema = z.object({
    body: z.object({
        bio: z.string().optional(),
        gradeLevel: z.string().optional(),
        subjectsOfInterest: z.array(z.string()).optional(),
    }),
});

const updateTutorProfileValidationSchema = z.object({
    body: z.object({
        bio: z.string().optional(),
        hourlyRate: z.number().positive().optional(),
        subjects: z.array(z.string()).optional(),
        availability: z
            .array(
                z.object({
                    day: z.enum([
                        "Saturday",
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                    ]),
                    startTime: z
                        .string()
                        .regex(
                            /^([01]?\d|2[0-3]):[0-5]\d$/,
                            "Invalid time format. Use HH:mm (24-hour format)."
                        ),
                    endTime: z
                        .string()
                        .regex(
                            /^([01]?\d|2[0-3]):[0-5]\d$/,
                            "Invalid time format. Use HH:mm (24-hour format)."
                        ),
                })
            )
            .optional(),
    }),
});

const updateAdminProfileValidationSchema = z.object({
    body: z.object({
        bio: z.string().optional(),
    }),
});

const updateUserByAdminValidationSchema = z.object({
    body: z.object({
        isActive: z.boolean().optional(),
    }),
});

export const UserValidation = {
    registerUserValidationSchema,
    updateStudentProfileValidationSchema,
    updateTutorProfileValidationSchema,
    updateAdminProfileValidationSchema,
    updateUserByAdminValidationSchema,
};
