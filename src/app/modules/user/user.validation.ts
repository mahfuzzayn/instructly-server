import { z } from "zod";
import { UserRole } from "./user.interface";

const registerUserValidationSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z
            .string()
            .min(6, "Password must be at least 6 characters long"),
        name: z.string().min(1, "Name is required"),
        role: z
            .enum([UserRole.STUDENT, UserRole.TUTOR])
            .default(UserRole.STUDENT),
    }),
});

export const UserValidation = {
    registerUserValidationSchema,
};
