import express from "express";
import { NewsController } from "./news.controller";
const router = express.Router();

router.get("/", NewsController.getAllNews);

export const NewsRoutes = router;
