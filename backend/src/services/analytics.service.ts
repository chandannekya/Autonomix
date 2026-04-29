import { prisma } from "../config/prisma.js";

export const getAnalyticsService = async (userId: string) => {
  // 1. Total Runs (all time)
  const totalRuns = await prisma.agentRun.count({
    where: {
      agent: {
        userId: userId,
      },
    },
  });

  // 2. Active Agents vs Total Agents
  const activeAgents = await prisma.agentConfig.count({
    where: {
      userId: userId,
      status: "active",
    },
  });
  
  const totalAgents = await prisma.agentConfig.count({
    where: {
      userId: userId,
    },
  });

  // 3. Execution Volume (Last 30 Days)
  // Get all runs for the user's agents in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const runsLast30Days = await prisma.agentRun.findMany({
    where: {
      agent: {
        userId: userId,
      },
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Group by day (YYYY-MM-DD)
  const runsPerDay = new Map<string, number>();
  
  // Initialize last 30 days with 0
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateString = d.toISOString().split("T")[0];
    runsPerDay.set(dateString, 0);
  }

  // Populate map with actual counts
  runsLast30Days.forEach((run) => {
    const dateString = run.createdAt.toISOString().split("T")[0];
    if (runsPerDay.has(dateString)) {
      runsPerDay.set(dateString, (runsPerDay.get(dateString) || 0) + 1);
    }
  });

  const chartData = Array.from(runsPerDay.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  return {
    totalRuns,
    activeAgents,
    totalAgents,
    chartData,
  };
};
