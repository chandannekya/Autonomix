import express from "express";
import { runAgent } from "../agents/agentExecutor.js";

const router = express.Router();

router.post("/run", async (req, res) => {
  const { id, task, history } = req.body;

  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }

  const result = await runAgent(id, task, history ?? []);
  console.log("result", result);
  return res.json({ data: result });
});

export default router;
