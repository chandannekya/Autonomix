import { tools } from "../tools/toolRegistry.js";
import { prisma } from "../config/prisma.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { storeMemory, queryMemory } from "../memory/vectorStore.js";

type Agent = {
  id: string;
  name: string;
  role: string;
  tools: string[];
  memoryEnabled: boolean;
};

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY!,
});

export async function runAgent(
  agentId: string,
  task: string,
  history: { role: string; content: string }[] = [],
) {
  // 1️⃣ Fetch agent config
  const agent = await prisma.agentConfig.findUnique({
    where: { id: agentId },
  });

  if (!agent) {
    return "Agent configuration not found";
  }

  // 2️⃣ System Prompt
  const systemPrompt = `
You are an autonomous AI agent named ${agent.name}.
Your role: ${agent.role}

You must respond ONLY in valid JSON.

You can use these tools:
${agent.tools.join(", ")}

If you need to use a tool, respond like this:

{
  "action": "tool",
  "reason": "I need GDP values to compute difference",
  "tool": "web_search",
  "input": "GDP of Japan and Germany"
}

If the task is complete, respond like this:

{
  "action": "final",
  "answer": "final answer here"
}
`;

  let memoryContext = "";

  if (agent.memoryEnabled) {
    memoryContext = await queryMemory(agent.id, task);
  }
  console.log("MEMORY CONTEXT:", memoryContext);

  // ✅ Build history text from previous messages
  const historyText =
    history.length > 0
      ? history
          .map((m) => `${m.role === "user" ? "User" : "Agent"}: ${m.content}`)
          .join("\n")
      : "No previous messages";

  // ✅ Context now includes full conversation history
  let context = `
Conversation history:
${historyText}

Current message: ${task}

Relevant past memory:
${memoryContext}
`;

  let iteration = 0;

  // 3️⃣ Autonomous Loop
  while (iteration < 5) {
    const llmResponse = await model.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: context },
    ]);

    // SAFELY extract content
    let rawContent = "";

    if (typeof llmResponse.content === "string") {
      rawContent = llmResponse.content;
    } else if (Array.isArray(llmResponse.content)) {
      rawContent = llmResponse.content
        .map((part: any) => part.text || "")
        .join("");
    } else {
      rawContent = JSON.stringify(llmResponse.content);
    }

    rawContent = rawContent.replace(/```json|```/g, "").trim();

    console.log("RAW LLM OUTPUT:", rawContent);

    let response: any;

    try {
      response = JSON.parse(rawContent);
    } catch (error) {
      return "Invalid JSON response from LLM";
    }

    // 4️⃣ If tool action
    if (response.action === "tool") {
      const toolName = response.tool;

      if (!agent.tools.includes(toolName)) {
        return `Tool "${toolName}" not allowed for this agent`;
      }

      const toolFunc = tools[toolName as keyof typeof tools];

      if (!toolFunc) {
        return `Tool "${toolName}" not implemented`;
      }

      const toolResult = await toolFunc(response.input);

      console.log("TOOL RESULT:", toolResult);

      if (agent.memoryEnabled) {
        await storeMemory(
          agent.id,
          `Tool Used: ${toolName}\nInput: ${response.input}\nResult: ${toolResult}`,
        );
      }

      // Append tool result to context
      context += `

Tool "${toolName}" result:
${toolResult}

Based on this result:
- If enough info, return final.
- Otherwise call another tool.
`;
    }

    if (response.action === "final") {
      if (agent.memoryEnabled) {
        // ✅ Store full conversation turn in memory
        await storeMemory(
          agent.id,
          `User: ${task}\nAssistant: ${response.answer}`,
        );
      }

      return response.answer;
    }

    iteration++;
  }

  return "Maximum iterations reached";
}
