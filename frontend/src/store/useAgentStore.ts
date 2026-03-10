// src/store/useAgentStore.ts
import { create } from "zustand";

type AgentData = {
  id: string;
  name: string;
  role: string;
  memoryEnabled: boolean;
  tools: string[];
};

interface AgentState {
  activeAgent: AgentData | null;
  setActiveAgent: (agent: AgentData) => void;
  clearActiveAgent: () => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  activeAgent: null,
  setActiveAgent: (agent) => set({ activeAgent: agent }),
  clearActiveAgent: () => set({ activeAgent: null }),
}));
