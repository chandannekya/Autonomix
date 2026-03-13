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

You must respond ONLY in valid JSON. No text before or after. No explanations. No markdown fences.
Your entire response must start with { and end with }.

AVAILABLE TOOLS: ${agent.tools.join(", ")}

TOOL DESCRIPTIONS:
- web_search: Search the internet for current information, facts, news, prices
- calculator: Evaluate math expressions like "10% of 3700000000000" or "sqrt(144)"
- summarizer: Summarize a long piece of text into key points
- pdf_generator: Generate a PDF from markdown text content and return a download URL

TO USE A TOOL respond with exactly:
{
  "action": "tool",
  "reason": "brief reason why you need this tool",
  "tool": "tool_name",
  "input": "plain string input only — never an object or array"
}

WHEN TASK IS COMPLETE respond with exactly:
{
  "action": "final",
  "answer": "your complete answer here"
}

STRICT RULES:
1. "input" must ALWAYS be a plain string — never an object, never an array
2. "tool" must be one of: ${agent.tools.join(", ")}
3. Never add text outside the JSON object
4. If pdf_generator returns a URL, include it in your final answer as [Download PDF](url)
5. If a tool fails, try a different approach — do not repeat the same failing tool call
6. Use tools only when necessary — if you already have the answer, return final immediately
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

    rawContent = extractJSON(rawContent);
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

      await prisma.agentRun.create({
        data: { agentId, task, response: response.answer },
      });

      return response.answer;
    }

    iteration++;
  }

  emit({ type: "error", message: "Maximum iterations reached" });
  return "Maximum iterations reached";
}

function extractJSON(raw: string): string {
  // Strip markdown fences
  let cleaned = raw.replace(/```json|```/g, "").trim();

  // Find the first {
  const start = cleaned.indexOf("{");
  if (start === -1) return cleaned;

  // Walk string tracking brace depth
  let depth = 0;
  let end = -1;
  let inString = false;
  let escape = false;

  for (let i = start; i < cleaned.length; i++) {
    const char = cleaned[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (char === "\\") {
      escape = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    // Only count braces outside of strings
    if (!inString) {
      if (char === "{") depth++;
      else if (char === "}") {
        depth--;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
  }

  if (end !== -1) {
    return cleaned.slice(start, end + 1);
  }

  return cleaned;
}
