import { prisma } from "../config/prisma.js";
import { runAgent } from "../agents/agentExecutor.js";
import { CronExpressionParser } from "cron-parser";
export function getNextRun(cron: string): Date {
  // Must parse in UTC — the cron expression is built as UTC by the frontend.
  // Without { tz: "UTC" }, the parser uses server local time (e.g. IST),
  // which stores nextRunAt 5h30m too early for IST users.
  const interval = CronExpressionParser.parse(cron, { tz: "UTC" });
  return interval.next().toDate();
}
export async function processDueAgents() {
  console.log("Scheduler tick —", new Date().toISOString());
  const now = new Date();

  const agents = await prisma.agentConfig.findMany({
    where: {
      status: "active",
      scheduleCron: { not: "" },
      task: { not: "" },
      nextRunAt: { lte: now },
      lockedAt: null,
    },
  });

  for (const agent of agents) {
    if (!agent.task || !agent.scheduleCron) continue;

    // Lock so concurrent ticks don't double-fire
    await prisma.agentConfig.update({
      where: { id: agent.id },
      data: { lockedAt: new Date() },
    });

    let runError: unknown = null;
    try {
      console.log(`[Scheduler] Running agent ${agent.id} — task: "${agent.task}"`);
      await runAgent(agent.id, agent.task, [], () => {}, agent.userId ?? undefined);
      console.log(`[Scheduler] Agent ${agent.id} completed`);
    } catch (err) {
      runError = err;
      console.error(`[Scheduler] Agent ${agent.id} run failed:`, err);
    }

    // Advance nextRunAt separately so a getNextRun failure never keeps
    // the agent locked. Always clear lockedAt no matter what.
    try {
      const scheduleCron = agent.scheduleCron; // already non-empty (guarded above)
      const nextRun = getNextRun(scheduleCron);
      console.log(`[Scheduler] Agent ${agent.id} next run at ${nextRun.toISOString()}`);
      await prisma.agentConfig.update({
        where: { id: agent.id },
        data: {
          lockedAt: null,
          lastRunAt: new Date(),
          nextRunAt: nextRun,
        },
      });
    } catch (advanceErr) {
      console.error(`[Scheduler] Failed to advance schedule for agent ${agent.id}:`, advanceErr);
      // Ensure lock is cleared even if nextRunAt update failed
      await prisma.agentConfig
        .update({ where: { id: agent.id }, data: { lockedAt: null } })
        .catch((e) => console.error(`[Scheduler] Failed to unlock agent ${agent.id}:`, e));
    }
  }
}