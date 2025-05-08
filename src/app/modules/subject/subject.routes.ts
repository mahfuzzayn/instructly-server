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

router.get(
    "/my-subjects",
    auth(UserRole.TUTOR),
    SubjectController.getMySubjects
);

router.get(
    "/:subjectId",
    SubjectController.getSingleSubject
);

router.get(
    "/",
    SubjectController.getAllSubjects
);

router.patch(
    "/:subjectId",
    auth(UserRole.TUTOR),
    SubjectController.updateSubject
);

router.patch(
    "/:subjectId/discontinue",
    auth(UserRole.TUTOR),
    SubjectController.discontinueSubject
);

export const SubjectRoutes = router;
