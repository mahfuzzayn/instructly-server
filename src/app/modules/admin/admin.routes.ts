import { Router } from "express";
import { AdminController } from "./admin.controller";

const router = Router();

router.get("/", AdminController.registerAdmin);

export const AdminRoutes = router;
