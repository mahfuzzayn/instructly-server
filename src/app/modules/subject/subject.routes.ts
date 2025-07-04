import { Router } from "express";
import { SubjectController } from "./subject.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";
import validateRequest from "../../middleware/validateRequest";
import { SubjectValidations } from "./subject.validation";

const router = Router();

router.get("/", SubjectController.getAllSubjects);

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
    "/admin",
    auth(UserRole.ADMIN),
    SubjectController.getAllSubjectsForAdmin
);

router.get("/:subjectId", SubjectController.getSingleSubject);

router.patch(
    "/:subjectId",
    auth(UserRole.TUTOR, UserRole.ADMIN),
    SubjectController.updateSubject
);

router.patch(
    "/:subjectId/discontinue",
    auth(UserRole.TUTOR),
    SubjectController.discontinueSubject
);

router.patch(
    "/:subjectId/change-status",
    auth(UserRole.ADMIN),
    validateRequest(SubjectValidations.changeSubjectStatusByAdminValidation),
    SubjectController.changeSubjectStatusByAdmin
);

export const SubjectRoutes = router;
