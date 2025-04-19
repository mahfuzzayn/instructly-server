import { Router } from "express";
import { UserController } from "./user.controller";
import auth from "../../middleware/auth";
import { UserRole } from "./user.interface";
import { UserValidation } from "./user.validation";
import validateRequest from "../../middleware/validateRequest";

const router = Router();

router.post(
    "/register-user",
    validateRequest(UserValidation.registerUserValidationSchema),
    UserController.registerUser
);

export const UserRoutes = router;
