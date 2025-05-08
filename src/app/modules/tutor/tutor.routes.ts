import { Router } from "express";
import { TutorController } from "./tutor.controller";

const router = Router();

router.get("/", TutorController.getAllTutors);

router.get("/:tutorId", TutorController.getSingleTutor);

export const TutorRoutes = router;
