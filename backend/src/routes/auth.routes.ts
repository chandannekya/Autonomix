import express from "express";
import { authService } from "../services/auth.service.js";

const router = express.Router();

router.post("/user", authService);

export default router;
