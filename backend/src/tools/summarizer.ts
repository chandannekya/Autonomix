import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY,
});

export const summarizer = async (text: string) => {
  const response = await model.invoke(
    `Summarize this text in 5 bullet points:\n\n${text}`,
  );

  return response.content;
};
