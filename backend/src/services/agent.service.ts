import { prisma } from "../config/prisma.js";
import { getNextRun } from "./scheduler.service.js";
import { isValidCron } from "cron-validator";

export const getAgentRunHistoryService = async (agentId: string) => {
  return await prisma.agentRun.findMany({
    where: { agentId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
};

export async function scheduleAgent(
  id: string,
  task: string,
  scheduleCron: string,
) {
  if (!isValidCron(scheduleCron, { seconds: false })) {
    throw new Error("Invalid cron expression");
  }

  return prisma.agentConfig.update({
    where: { id },
    data: {
      task,
      scheduleCron,
      nextRunAt: getNextRun(scheduleCron),
      status: "active",
    },
  });
}

export async function deleteSchedule(id: string) {
  const response = await prisma.agentConfig.update({
    where: { id },
    data: {
      task: "",
      scheduleCron: "",
      nextRunAt: null,
      status: "paused",
    },
  });

  return response;
}


