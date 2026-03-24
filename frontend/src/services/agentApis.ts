// services/agent.service.ts
import api from "./client";
import { getSession } from "next-auth/react";
const endPoints = {
  // Agent Routes (Existing)
  createAgent: "agents/create",
  getAgents: "agents",
  runAgent: "agent/run",
  runHistory: "agent/:id/run",

  // Integration Routes (New)
  saveApiKey: "integrations/apikey",
  getUserIntegrations: "integrations/user",
  removeIntegration: "integrations/:provider",

  // Google OAuth Routes
  googleConnect: "integrations/google/connect",
  googleCallback: "integrations/google/callback",
};
export interface AgentResponse {
  data: string;
  status: string;
}

export type Integration = {
  provider: string;
  authType: string;
  apiName?: string;
  createdAt: string;
};

export type SaveApiKeyParams = {
  userId: string;
  provider: string;
  apiKey: string;
  apiUrl?: string;
  apiName?: string;
};

export type SSEStep =
  | { type: "thinking"; message: string }
  | { type: "memory"; hasMemory: boolean; count: number }
  | { type: "tool_selected"; tool: string; input: string; reason?: string }
  | { type: "tool_result"; tool: string; result: string; time: string }
  | { type: "final"; answer: string }
  | { type: "error"; message: string };

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

export const streamAgentRun = async (
  data: {
    id: string;
    task: string;
    history: { role: string; content: string }[];
  },
  onStep: (step: SSEStep) => void,
  onDone: () => void,
  onError: (msg: string) => void,
): Promise<EventSource> => {
  const session = await getSession();
  const token = session?.backendToken ?? "";

  const query = new URLSearchParams({
    id: data.id,
    task: data.task,
    history: JSON.stringify(data.history),
    token,
  });

  const eventSource = new EventSource(
    `${process.env.NEXT_PUBLIC_BASE_URL}/agent/run/stream?${query}`,
  );

  eventSource.onmessage = (e) => {
    const step: SSEStep = JSON.parse(e.data);
    onStep(step);

    if (step.type === "final" || step.type === "error") {
      eventSource.close();
      onDone();
    }
  };

  eventSource.onerror = () => {
    eventSource.close();
    onError("SSE_CONNECTION_LOST");
    onDone();
  };

  return eventSource;
};

export const getRunHistory = async (agentId: string) => {
  const url = endPoints.runHistory.replace(":id", agentId);
  const response = await api.get(url);
  return response.data;
};

export const saveApiKey = async (data: SaveApiKeyParams): Promise<unknown> => {
  const response = await api.post(endPoints.saveApiKey, data);
  return response.data;
};

export const getIntegrations = async (): Promise<Integration[]> => {
  const res = await api.get(endPoints.getUserIntegrations);
  console.log(res.data, "intregation ");
  return res.data.data;
};

export const removeIntegration = async (provider: string): Promise<unknown> => {
  const url = endPoints.removeIntegration.replace(":provider", provider);
  const response = await api.delete(url);
  return response.data;
};

export const getGoogleConnectUrl = async (): Promise<{ url: string }> => {
  const response = await api.get(endPoints.googleConnect);
  return response.data;
};

export const handleGoogleCallback = async (
  queryParams: string,
): Promise<unknown> => {
  const response = await api.get(`${endPoints.googleCallback}?${queryParams}`);
  return response.data;
};
