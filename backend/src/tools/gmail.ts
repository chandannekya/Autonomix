import { google } from "googleapis";
import { prisma } from "../config/prisma.js";

export const gmailTool = async (
  input: string,
  userId: string,
): Promise<string> => {
  try {
    if (!userId) {
      return "Error: User ID is required to access Gmail.";
    }
    
    // We can use the same Google integration, just make sure scope includes Gmail
    const integration = await prisma.userIntegration.findUnique({
      where: { userId_provider: { userId, provider: "google" } },
    });

    if (!integration || !integration.refreshToken) {
      return "Error: Google is not connected. Please ask the user to connect it in the Integrations menu.";
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    oauth2Client.setCredentials({
      refresh_token: integration.refreshToken,
      access_token: integration.accessToken || undefined,
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    
    // Parse input (we support JSON or a key:value|key:value format)
    let parts: Record<string, string> = {};
    try {
      parts = JSON.parse(input);
    } catch {
      input.split("|").forEach((part) => {
        const colonIndex = part.indexOf(":");
        if (colonIndex !== -1) {
          const key = part.slice(0, colonIndex).trim().toLowerCase();
          const value = part.slice(colonIndex + 1).trim();
          parts[key] = value;
        }
      });
    }

    const action = parts["action"] || "list";

    // ── LIST EMAILS ───────────────────────────────────────────────────────────
    if (action === "list") {
      const maxResults = parseInt(parts["limit"] || "5");
      const query = parts["query"] || "is:inbox";

      const res = await gmail.users.messages.list({
        userId: "me",
        maxResults,
        q: query,
      });

      const messages = res.data.messages;
      if (!messages || messages.length === 0) {
        return "No emails found matching the query.";
      }

      const emailDetails = await Promise.all(
        messages.map(async (msg) => {
          if (!msg.id) return null;
          const msgData = await gmail.users.messages.get({
            userId: "me",
            id: msg.id,
            format: "metadata",
            metadataHeaders: ["From", "Subject", "Date"],
          });
          
          const headers = msgData.data.payload?.headers;
          const from = headers?.find((h) => h.name === "From")?.value || "Unknown";
          const subject = headers?.find((h) => h.name === "Subject")?.value || "No Subject";
          const date = headers?.find((h) => h.name === "Date")?.value || "Unknown Date";

          return `ID: ${msg.id}\nFrom: ${from}\nSubject: ${subject}\nDate: ${date}\n---`;
        })
      );

      return `Latest ${maxResults} emails:\n\n${emailDetails.filter(Boolean).join("\n")}`;
    }

    // ── READ EMAIL ────────────────────────────────────────────────────────────
    if (action === "read") {
      const messageId = parts["id"];
      if (!messageId) {
        return "Error: Missing 'id' field for reading an email.";
      }

      const res = await gmail.users.messages.get({
        userId: "me",
        id: messageId,
        format: "full",
      });

      const payload = res.data.payload;
      
      const getBody = (payload: any): string => {
        let body = "";
        if (payload.parts) {
          payload.parts.forEach((part: any) => {
            if (part.mimeType === "text/plain") {
              if (part.body && part.body.data) {
                body += Buffer.from(part.body.data, "base64").toString("utf-8");
              }
            } else if (part.parts) {
              body += getBody(part);
            }
          });
        } else if (payload.body && payload.body.data) {
          body = Buffer.from(payload.body.data, "base64").toString("utf-8");
        }
        return body;
      };

      const bodyText = getBody(payload);
      return `Email Content (ID: ${messageId}):\n\n${bodyText.substring(0, 2000)}${bodyText.length > 2000 ? "\n...(truncated)" : ""}`;
    }

    // ── SEND EMAIL ────────────────────────────────────────────────────────────
    if (action === "send") {
      const to = parts["to"];
      const subject = parts["subject"] || "Message from AutonomiX";
      const body = parts["body"] || "";

      if (!to || !body) {
        return "Error: Missing 'to' or 'body' fields for sending an email.";
      }

      const messageParts = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/plain; charset="UTF-8"',
        'MIME-Version: 1.0',
        '',
        body
      ];
      const message = messageParts.join('\n');
      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: encodedMessage,
        },
      });

      return `Successfully sent email via Gmail to ${to}.`;
    }

    return "Error: Unknown action. Use action:list, action:read, or action:send";
  } catch (error: any) {
    console.error("[gmail tool] Error:", error.message);
    return `Gmail error: ${error.message}`;
  }
};
