import { Router } from "express";
import { ReviewController } from "./review.controller";
import auth from "../../middleware/auth";
import User from "../user/user.model";
import { UserRole } from "../user/user.interface";
import validateRequest from "../../middleware/validateRequest";
import { ReviewValidations } from "./review.validation";

const router = Router();

router.post(
    "/give-review",
    auth(UserRole.STUDENT),
    ReviewController.giveReview
);

router.get(
    "/me",
    auth(UserRole.STUDENT, UserRole.TUTOR),
    ReviewController.getMyReviews
);

router.get("/:reviewId", ReviewController.getSingleReview);

router.get("/", auth(UserRole.ADMIN), ReviewController.getAllReviews);

router.patch(
    "/:reviewId/change-visibility",
    auth(UserRole.ADMIN),
    validateRequest(ReviewValidations.changeReviewVisibilityByAdminValidation),
    ReviewController.changeReviewVisibilityByAdmin
);

export const ReviewRoutes = router;
