import { Router } from "express";
import { AdminController } from "./admin.controller";
import { UserRole } from "../user/user.interface";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth(UserRole.ADMIN), AdminController.registerAdmin);

router.get("/", auth(UserRole.ADMIN), AdminController.getAllAdmins);

router.get("/:adminId", auth(UserRole.ADMIN), AdminController.getSingleAdmin);

export const AdminRoutes = router;
