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
  emit: (event: object) => void,
) {
  const agent = await prisma.agentConfig.findUnique({
    where: { id: agentId },
  });

  if (!agent) {
    emit({ type: "error", message: "Agent not found" });
    return "Agent configuration not found";
  }

  const systemPrompt = `
You are an autonomous AI agent named ${agent.name}.
Your role: ${agent.role}

You must respond ONLY in valid JSON.

You can use these tools: ${agent.tools.join(", ")}

To use a tool:
{ "action": "tool", "reason": "why you need this tool", "tool": "tool_name", "input": "input here" }

When done:
{ "action": "final", "answer": "complete answer here" }
`;

  emit({ type: "thinking", message: "Retrieving relevant memories..." });

  let memoryContext = "";
  if (agent.memoryEnabled) {
    memoryContext = await queryMemory(agent.id, task);
  }

  emit({
    type: "memory",
    hasMemory: memoryContext.length > 0,
    count: memoryContext.length > 0 ? 1 : 0,
  });

  const historyText =
    history.length > 0
      ? history
          .map((m) => `${m.role === "user" ? "User" : "Agent"}: ${m.content}`)
          .join("\n")
      : "No previous messages";

  let context = `
Conversation history:
${historyText}

Current message: ${task}

Relevant past memory:
${memoryContext || "None"}
`;

  let iteration = 0;

  while (iteration < 5) {
    emit({
      type: "thinking",
      message: `Reasoning... (iteration ${iteration + 1})`,
    });

    const llmResponse = await model.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: context },
    ]);

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
    } catch {
      emit({ type: "error", message: "LLM returned invalid JSON" });
      return "Invalid JSON response from LLM";
    }

    if (response.action === "tool") {
      const toolName = response.tool;

      // ✅ Validate before emitting
      if (!agent.tools.includes(toolName)) {
        emit({ type: "error", message: `Tool "${toolName}" not allowed` });
        return `Tool "${toolName}" not allowed for this agent`;
      }

      const toolFunc = tools[toolName as keyof typeof tools];
      if (!toolFunc) {
        emit({ type: "error", message: `Tool "${toolName}" not implemented` });
        return `Tool "${toolName}" not implemented`;
      }

      emit({
        type: "tool_selected",
        tool: toolName,
        input: response.input,
        reason: response.reason,
      });

      // ✅ Timer starts before execution
      const start = Date.now();
      const toolResult = await toolFunc(response.input);
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);

      emit({
        type: "tool_result",
        tool: toolName,
        result: toolResult.slice(0, 200),
        time: `${elapsed}s`,
      });

      if (agent.memoryEnabled) {
        await storeMemory(
          agent.id,
          `Tool: ${toolName}\nInput: ${response.input}\nResult: ${toolResult}`,
        );
      }

      context += `\nTool "${toolName}" result:\n${toolResult}\n\nContinue reasoning or return final answer.`;
    }

    if (response.action === "final") {
      emit({ type: "final", answer: response.answer });

      if (agent.memoryEnabled) {
        await storeMemory(agent.id, `User: ${task}\nAgent: ${response.answer}`);
      }

      return response.answer;
    }

    iteration++;
  }

  emit({ type: "error", message: "Maximum iterations reached" });
  return "Maximum iterations reached";
}
