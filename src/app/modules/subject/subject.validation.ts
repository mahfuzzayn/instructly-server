import { z } from "zod";

const subjectValidation = {
    create: z.object({
        name: z.string().min(1, "Name is required"),
    }),
    update: z.object({
        id: z.string().uuid("Invalid ID format"),
        name: z.string().optional(),
    }),
};

const changeSubjectStatusByAdminValidation = z.object({
    body: z.object({
        status: z.enum(["active", "discontinued"]).optional(),
    }),
});

export const SubjectValidations = {
    subjectValidation,
    changeSubjectStatusByAdminValidation,
};
