import api from "./client";

// ✅ Move endpoints to top so they're not hoisted issues
const endPoints = {
  createAgent: "agents/create",
  getAgents: "agents",
  runAgent: "agent/run",
  runHistory: "agent/:id/run",
};

export interface AgentResponse {
  data: string;
  status: string;
}

export type SSEStep =
  | { type: "thinking"; message: string }
  | { type: "memory"; hasMemory: boolean; count: number }
  | { type: "tool_selected"; tool: string; input: string; reason?: string }
  | { type: "tool_result"; tool: string; result: string; time: string }
  | { type: "final"; answer: string }
  | { type: "error"; message: string };

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

export const streamAgentRun = (
  data: {
    id: string;
    task: string;
    history: { role: string; content: string }[];
  },
  onStep: (step: SSEStep) => void,
  onDone: () => void,
  onError: (msg: string) => void,
): EventSource => {
  const query = new URLSearchParams({
    id: data.id,
    task: data.task,
    history: JSON.stringify(data.history),
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
