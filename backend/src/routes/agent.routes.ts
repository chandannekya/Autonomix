import express from "express";
import { runAgent } from "../agents/agentExecutor.js";
import { getAgentRunHistory } from "../services/agent.service.js";

const router = express.Router();

// Old route — keep for fallback
router.post("/run", async (req, res) => {
  const { id, task, history } = req.body;

  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }

  const result = await runAgent(id, task, history ?? [], () => {}); // ✅ no-op emit
  return res.json({ data: result });
});

// SSE streaming route
router.get("/run/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // ✅ flush immediately so browser knows stream started

  const id = req.query.id as string;
  const task = req.query.task as string;
  const history = req.query.history as string;

  if (!id || !task) {
    res.write(
      `data: ${JSON.stringify({ type: "error", message: "id and task required" })}\n\n`,
    );
    res.end();
    return;
  }

  const send = (data: object) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  await runAgent(id, task, JSON.parse(history || "[]"), send);
  res.end();
});

router.get("/:id/run", getAgentRunHistory);

export default router;
