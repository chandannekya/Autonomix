import express from "express";
import {
  runAgentHandler,
  streamAgentHandler,
  getAgentHistoryHandler,
} from "../controllers/agent.controller.js";

const router = express.Router();

router.post("/run", runAgentHandler);
router.get("/run/stream", streamAgentHandler);
router.get("/:id/run", getAgentHistoryHandler);

export default router;
