"use client";
import {
  useMutation,
  useQuery,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  createAgentApi,
  getAgents,
  getRunHistory,
  runAgent,
} from "../services/agentApis";

interface AgentResponse {
  data: string;
  status: string;
}

interface CreateAgentVariables {
  agent_name: string;
  goal: string;
}

interface RunAgentVariables {
  id: string;
  task: string;
  history: { role: string; content: string }[];
}

export const useCreateAgent = (
  options?: UseMutationOptions<AgentResponse, Error, CreateAgentVariables>,
) => {
  return useMutation<AgentResponse, Error, CreateAgentVariables>({
    mutationFn: createAgentApi,
    ...options,
  });
};

export const useAllAgents = () => {
  return useQuery({
    queryKey: ["agents"],
    queryFn: getAgents,
  });
};

export const useRunAgent = (
  options?: UseMutationOptions<AgentResponse, Error, RunAgentVariables>,
) => {
  return useMutation<AgentResponse, Error, RunAgentVariables>({
    mutationFn: runAgent,
    ...options,
  });
};

export const useAgentRuns = (agentId: string) => {
  return useQuery({
    queryKey: ["run", agentId],
    queryFn: () => getRunHistory(agentId),
    enabled: !!agentId,
    staleTime: 1000 * 30,
  });
};
