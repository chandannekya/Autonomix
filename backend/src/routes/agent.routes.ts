import express from "express";
import {
  runAgentHandler,
  streamAgentHandler,
  getAgentHistoryHandler,
  scheduleAgentHandler,
  deleteScheduleAgent,
} from "../controllers/agent.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/run", authMiddleware, runAgentHandler);
router.post("/run/stream", authMiddleware, streamAgentHandler);
router.get("/:id/run", authMiddleware, getAgentHistoryHandler);
router.put("/:id/schedule", authMiddleware, scheduleAgentHandler);
router.put("/:id/deleteSchedule", authMiddleware, deleteScheduleAgent);

export default router;
