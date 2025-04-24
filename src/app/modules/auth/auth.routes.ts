import { Router } from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";

const router = Router();

router.post("/login", AuthController.loginUser);

export const AuthRoutes = router;
