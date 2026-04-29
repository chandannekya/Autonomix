import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/", authMiddleware, getAnalytics);

export default router;
