-- CreateIndex
CREATE INDEX "agent_config_status_nextRunAt_idx" ON "agent_config"("status", "nextRunAt");
