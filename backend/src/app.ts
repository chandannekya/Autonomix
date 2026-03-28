import express from "express";
import cors from "cors";
import agentRoutes from "./routes/agent.routes.js";
import authRoutes from "./routes/auth.routes.js";
import agentCreationRoutes from "./routes/agentCreation.routes.js";
import integrationRoutes from "./routes/integration.routes.js";
import { cloudnaryConfig } from "./config/cloudinary.js";
import { google } from "googleapis";
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
app.use("/api/auth", authRoutes);
app.use("/api/integrations", integrationRoutes);

// ── Temporary Google OAuth callback — delete after getting token ──
app.get("/auth/google/callback", async (req, res) => {
  try {
    const code = req.query.code as string;

    if (!code) {
      res.send("<h2>Error: No code found in URL</h2>");
      return;
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    const { tokens } = await oauth2Client.getToken(code);

    console.log("=================================");
    console.log("REFRESH TOKEN:", tokens.refresh_token);
    console.log("=================================");

    res.send(`
      <html>
        <body style="font-family: monospace; padding: 40px;">
          <h2>✅ Success! Copy this into your .env</h2>
          <p><strong>GOOGLE_REFRESH_TOKEN=</strong></p>
          <p style="background:#f0f0f0; padding:10px; word-break:break-all;">
            ${tokens.refresh_token}
          </p>
          <p style="color:red;">Delete the /auth/google/callback route after copying this.</p>
        </body>
      </html>
    `);
  } catch (error) {
    const err = error as Error;
    res.send(`<h2>Error: ${err.message}</h2>`);
  }
});
// ── End temporary route ──────────────────────────────────────────

cloudnaryConfig();

export default app;
