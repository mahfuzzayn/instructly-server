import { Router } from "express";
import { StudentController } from "./student.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";

const router = Router();

router.get("/", auth(UserRole.ADMIN), StudentController.getAllStudents);

router.get(
    "/:studentId",
    auth(UserRole.ADMIN, UserRole.TUTOR, UserRole.STUDENT),
    StudentController.getSingleStudent
);

export const StudentRoutes = router;
