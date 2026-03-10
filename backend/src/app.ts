import express from "express";
import cors from "cors";
import agentRoutes from "./routes/agent.routes.js";
import agentCreationRoutes from "./routes/agentCreation.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api/agents", agentCreationRoutes);
app.use("/api/agent", agentRoutes);

export default app;
