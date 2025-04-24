import { Router } from "express";
import { SubjectController } from "./subject.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";

const router = Router();

router.post(
    "/create-subject",
    auth(UserRole.TUTOR),
    SubjectController.createSubject
);

export const SubjectRoutes = router;
