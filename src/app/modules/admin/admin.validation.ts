import { Types } from "mongoose";
import { z } from "zod";

export const registerAdminValidationSchema = z.object({
    name: z.string().min(1, "Name is required."),
    email: z.string().email("Invalid email address."),
    user: z.instanceof(Types.ObjectId),
    bio: z.string().nullable().optional(),
    profileUrl: z
        .string()
        .regex(
            /^(http(s)?:\/\/.*\.(?:png|jpg|jpeg))$/,
            "Invalid photo URL format. Must be a valid image URL."
        ),
});

export const AdminValidations = {
    registerAdminValidationSchema,
};
