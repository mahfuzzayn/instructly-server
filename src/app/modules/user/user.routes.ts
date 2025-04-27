import { Router } from "express";
import { UserController } from "./user.controller";
import auth from "../../middleware/auth";
import { UserRole } from "./user.interface";
import { UserValidation } from "./user.validation";
import validateRequest from "../../middleware/validateRequest";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middleware/bodyParse";

const router = Router();

router.post(
    "/register-user",
    validateRequest(UserValidation.registerUserValidationSchema),
    UserController.registerUser
);

router.get("/me", auth(UserRole.STUDENT, UserRole.TUTOR), UserController.getMe);

router.patch(
    "/student/update-profile",
    auth(UserRole.STUDENT),
    multerUpload.single("image"),
    parseBody,
    validateRequest(UserValidation.updateStudentProfileValidationSchema),
    UserController.updateStudentProfile
);

router.patch(
    "/tutor/update-profile",
    auth(UserRole.TUTOR),
    multerUpload.single("image"),
    parseBody,
    validateRequest(UserValidation.updateTutorProfileValidationSchema),
    UserController.updateTutorProfile
);

export const UserRoutes = router;
