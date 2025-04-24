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
    "/:subjectId",
    auth(UserRole.TUTOR, UserRole.STUDENT),
    SubjectController.getSingleSubject
);

router.get(
    "/",
    auth(UserRole.TUTOR, UserRole.STUDENT),
    SubjectController.getAllSubjects
);

router.patch(
    "/:subjectId",
    auth(UserRole.TUTOR),
    SubjectController.updateSubject
);

router.delete(
    "/:subjectId",
    auth(UserRole.TUTOR),
    SubjectController.deleteSubject
);

export const SubjectRoutes = router;
