import express from "express";
import { createAgent, getAllAgents } from "../models/agentStore.js";
import { v4 as uuidv4 } from "uuid";
import {
  createAgentConfig,
  getAgentConfigById,
  getAllAgentConfigs,
} from "../services/agentGenerator.service.js";
import { runAgent } from "../agents/agentExecutor.js";
// type Agent = {
//   id: string;
//   name: string;
//   role: string;
//   tools: string[];
//   memoryEnabled: boolean;
// };

const router = express.Router();

router.post("/create", async (req, res) => {
  const { agent_name, goal } = req.body;
  const genratedconfig = await createAgentConfig(agent_name, goal);

  // const newAgent = createAgent({
  //   id: uuidv4(),
  // });

  res.json(genratedconfig);
});

router.get("/", async (req, res) => {
  const agentConfigs = await getAllAgentConfigs();
  res.json(agentConfigs);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const agentConfig = await getAgentConfigById(id);
  if (!agentConfig) {
    return res.status(404).json({ error: "Agent config not found" });
  }
  res.json(agentConfig);
});

router.delete("/:id/memory", async (req, res) => {
  try {
    const { id } = req.params;
    const { ChromaClient } = await import("chromadb");
    const client = new ChromaClient();
    await client.deleteCollection({ name: `agent_memory_${id}` });
    res.status(200).json({ message: "Memory cleared" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing memory" });
  }
});
export default router;
