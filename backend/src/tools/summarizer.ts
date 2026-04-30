import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";
const primaryModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY,
  maxRetries: 1,
});

const fallbackModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  maxRetries: 2,
});

const model = primaryModel.withFallbacks({
  fallbacks: [fallbackModel],
});

export const summarizer = async (text: string) => {
  const response = await model.invoke(
    `Summarize this text in 5 bullet points:\n\n${text}`,
  );

  const content = response.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return (content as Array<{ text?: string }>)
      .map((part) => part.text || "")
      .join("");
  }
  return String(content);
};
