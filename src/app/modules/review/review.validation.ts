import { z } from "zod";

const changeReviewVisibilityByAdminValidation = z.object({
    body: z.object({
        isVisible: z.boolean().optional(),
    }),
});

export const ReviewValidations = { changeReviewVisibilityByAdminValidation };
