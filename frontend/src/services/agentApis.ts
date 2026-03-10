import api from "./client";

// ✅ Move endpoints to top so they're not hoisted issues
const endPoints = {
  createAgent: "agents/create",
  getAgents: "agents",
  runAgent: "agent/run",
};

export interface AgentResponse {
  data: string;
  status: string;
}

// ✅ Proper return type + throw on error
export const createAgentApi = async (data: {
  agent_name: string;
  goal: string;
}): Promise<AgentResponse> => {
  const agent = await api.post(endPoints.createAgent, data);
  return agent.data;
};

export const getAgents = async () => {
  const agents = await api.get(endPoints.getAgents);
  return agents.data;
};

export const runAgent = async (data: {
  id: string;
  task: string;
  history: { role: string; content: string }[];
}): Promise<AgentResponse> => {
  const execution = await api.post(endPoints.runAgent, data);
  return execution.data;
};
