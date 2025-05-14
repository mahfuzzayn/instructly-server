import { Router } from "express";
import { ReviewController } from "./review.controller";
import auth from "../../middleware/auth";
import User from "../user/user.model";
import { UserRole } from "../user/user.interface";

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

router.get("/", ReviewController.getAllReviews);

export const ReviewRoutes = router;
