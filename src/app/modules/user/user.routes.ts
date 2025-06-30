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

router.get(
    "/me",
    auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
    UserController.getMe
);

// Student Routes
router.patch(
    "/student/update-profile",
    auth(UserRole.STUDENT),
    multerUpload.single("image"),
    parseBody,
    validateRequest(UserValidation.updateStudentProfileValidationSchema),
    UserController.updateStudentProfile
);

// Tutor Routes
router.patch(
    "/tutor/update-profile",
    auth(UserRole.TUTOR),
    multerUpload.single("image"),
    parseBody,
    validateRequest(UserValidation.updateTutorProfileValidationSchema),
    UserController.updateTutorProfile
);

// Admin Routes
router.patch(
    "/admin/update-profile",
    auth(UserRole.ADMIN),
    multerUpload.single("image"),
    parseBody,
    validateRequest(UserValidation.updateAdminProfileValidationSchema),
    UserController.updateAdminProfile
);

router.get("/", auth(UserRole.ADMIN), UserController.getAllUsers);

router.patch(
    "/:userId",
    auth(UserRole.ADMIN),
    validateRequest(UserValidation.updateUserByAdminValidationSchema),
    UserController.updateUserByAdmin
);

export const UserRoutes = router;
