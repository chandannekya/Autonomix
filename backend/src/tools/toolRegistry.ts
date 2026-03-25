import { calculator } from "./calculator.js";
import { webSearch } from "./web_search.js";
import { summarizer } from "./summarizer.js";
import { pdfGenerator } from "./pdfGenerator.js";
import { sendEmail } from "./emailSender.js";
import { googleCalendar } from "./calendar.js";
export const tools: Record<
  string,
  (input: string, userId: string) => Promise<string>
> = {
  calculator,
  web_search: webSearch,
  summarizer,
  google_calendar: googleCalendar,
  pdf_generator: async (input: string) => {
    const url = await pdfGenerator(input);
    return `PDF generated successfully. [Download PDF](${url})`;
  },
  send_email: async (input: string): Promise<string> => {
    const parts: Record<string, string> = {};

    input.split("|").forEach((part) => {
      const colonIndex = part.indexOf(":");
      if (colonIndex !== -1) {
        const key = part.slice(0, colonIndex).trim().toLowerCase();
        const value = part.slice(colonIndex + 1).trim();
        parts[key] = value;
      }
    });

    const to = parts["to"];
    const subject = parts["subject"] || "Message from AutonomiX Agent";
    const body = parts["body"] || "";

    if (!to) return "Error: Missing 'to' field";
    if (!body) return "Error: Missing 'body' field";

    return await sendEmail(to, body, subject);
  },
};
