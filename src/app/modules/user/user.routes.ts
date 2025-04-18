import { Router } from "express";
import { UserController } from "./user.controller";
import clientInfoParser from "../../middleware/clientInfoParser";
import validateRequest from "../../middleware/validateRequest";
import { UserValidation } from "./user.validation";
import auth from "../../middleware/auth";
import { UserRole } from "./user.interface";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middleware/bodyParser";

const router = Router();

router.get("/", auth(UserRole.TUTOR), UserController.getAllUser);

router.get(
    "/me",
    auth(UserRole.ADMIN, UserRole.TUTOR, UserRole.USER),
    UserController.myProfile
);

router.post(
    "/",
    clientInfoParser,
    validateRequest(UserValidation.userValidationSchema),
    UserController.registerUser
);

// Update Profile
router.patch(
    "/update-profile",
    auth(UserRole.USER),
    multerUpload.single("profilePhoto"),
    parseBody,
    validateRequest(UserValidation.customerInfoValidationSchema),
    UserController.updateProfile
);

router.patch(
    "/:id/status",
    auth(UserRole.ADMIN),
    UserController.updateUserStatus
);

export const UserRoutes = router;
