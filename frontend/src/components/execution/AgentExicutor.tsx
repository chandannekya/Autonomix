"use client";

import React, { useRef, useState, useEffect } from "react";
import { Square, Cpu, Activity, Zap, RotateCcw } from "lucide-react";
import { useAgentStore } from "@/store/useAgentStore";
import { useRunAgent } from "@/hooks/useAgents";
import ReactMarkdown from "react-markdown";

const AgentExecutor: React.FC = () => {
  const [task, setTask] = useState("");
  const [history, setHistory] = useState<{ role: string; content: string }[]>(
    [],
  );
  const [isRunning, setIsRunning] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "BOOTING_AUTONOMIX_OS...",
    "LINK_ESTABLISHED_WITH_CORE",
    "READY_FOR_DIRECTIVE",
  ]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [terminalLogs, isRunning]);

  const activeAgent = useAgentStore((state) => state.activeAgent);

  const { mutate } = useRunAgent({
    onSuccess: (data) => {
      const timestamp = new Date().toLocaleTimeString([], { hour12: false });
      const output = data.data || "TASK_COMPLETED_SUCCESSFULLY";
      setHistory((prev) => [...prev, { role: "assistant", content: output }]);
      setTerminalLogs((prev) => [
        ...prev,
        `[${timestamp}] > RESPONSE: ${output}`,
      ]);
      setIsRunning(false);
      setTask("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    },
    onError: (error) => {
      const timestamp = new Date().toLocaleTimeString([], { hour12: false });
      setTerminalLogs((prev) => [
        ...prev,
        `[${timestamp}] ! ERROR: ${error.message || "EXECUTION_FAILED"}`,
      ]);
      setIsRunning(false);
    },
  });

  if (!activeAgent) {
    return (
      <div className="flex h-screen items-center justify-center font-mono">
        <div className="text-center space-y-3">
          <div className="flex justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-text-disabled animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-text-disabled animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-text-disabled animate-bounce" />
          </div>
          <p className="text-text-muted text-xs uppercase tracking-widest">
            [!] No active agent detected
          </p>
          <p className="text-text-disabled text-[10px] uppercase tracking-widest">
            Please select an agent from dashboard
          </p>
        </div>
      </div>
    );
  }

  const handleTaskInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTask(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleClearSession = () => {
    setHistory([]);
    setTerminalLogs([
      "SESSION_CLEARED...",
      "MEMORY_WIPED",
      "READY_FOR_NEW_DIRECTIVE",
    ]);
    setTask("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const toggleExecution = () => {
    if (!task.trim() || isRunning) return;

    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    const updatedHistory = [...history, { role: "user", content: task }];
    setHistory(updatedHistory);
    setIsRunning(true);
    setTerminalLogs((prev) => [
      ...prev,
      `[${timestamp}] > DIRECTIVE_RECEIVED: ${task.substring(0, 50)}${task.length > 50 ? "..." : ""}`,
    ]);
    mutate({ id: activeAgent.id, task, history: updatedHistory });
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4 font-sans pb-12">
      <div className="relative rounded-xl border border-border-soft bg-bg-secondary shadow-lg overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-soft px-5 py-3 bg-bg-tertiary/50">
          <div className="flex items-center gap-4">
            {/* Mac dots */}
            <div className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500/60" />
              <span
                className={`h-2 w-2 rounded-full ${isRunning ? "bg-green-400 animate-pulse" : "bg-yellow-500/60"}`}
              />
              <span className="h-2 w-2 rounded-full bg-blue-500/60" />
            </div>

            {/* Agent name */}
            <div className="flex items-center gap-2 font-mono">
              <span className="text-[10px] text-text-muted uppercase tracking-tighter">
                Active Agent:
              </span>
              <span className="text-xs text-accent-cyan font-bold leading-none tracking-tight">
                {activeAgent.name}
              </span>
            </div>

            {/* Agent tools */}
            {activeAgent.tools?.length > 0 && (
              <div className="hidden sm:flex gap-1">
                {activeAgent.tools.map((tool: string) => (
                  <span
                    key={tool}
                    className="px-1.5 py-0.5 rounded border border-border-soft bg-bg-primary text-[9px] font-mono text-text-disabled uppercase tracking-widest"
                  >
                    {tool.replace("_", " ")}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClearSession}
              disabled={isRunning}
              title="Clear session"
              className="text-text-muted hover:text-text-primary transition-colors disabled:opacity-30"
            >
              <RotateCcw size={13} />
            </button>
            <Activity
              size={14}
              className={isRunning ? "text-green-400" : "text-text-muted"}
            />
          </div>
        </div>

        {/* Terminal Output */}
        <div
          className="relative bg-bg-primary h-[420px] p-6 font-mono text-[13px] overflow-y-auto terminal-scroll"
          ref={scrollRef}
        >
          {/* CRT scanline */}
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,128,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />

          <div className="space-y-3 relative z-0">
            {terminalLogs.map((log, i) => {
              const isDirective = log.includes("> DIRECTIVE_RECEIVED");
              const isResponse = log.includes("> RESPONSE");
              const isError =
                log.includes("] ! ERROR") || log.includes("Invalid");

              return (
                <div key={i} className="flex gap-4 items-start">
                  <span className="text-text-disabled shrink-0 text-[10px] mt-1 font-mono">
                    [{i}]
                  </span>
                  <div
                    className={`leading-relaxed text-[13px] ${
                      isError
                        ? "text-red-400"
                        : isDirective
                          ? "text-green-400 font-bold"
                          : isResponse
                            ? "text-accent-cyan"
                            : "text-text-secondary"
                    }`}
                  >
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <span className="block mb-1 last:mb-0">
                            {children}
                          </span>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-none space-y-1 mt-1">
                            {children}
                          </ul>
                        ),
                        li: ({ children }) => (
                          <li className="flex gap-2 items-start">
                            <span className="text-accent-cyan/50 shrink-0">
                              ▸
                            </span>
                            <span>{children}</span>
                          </li>
                        ),
                        strong: ({ children }) => (
                          <span className="text-text-primary font-bold">
                            {children}
                          </span>
                        ),
                        code: ({ children }) => (
                          <span className="px-1 py-0.5 rounded bg-bg-tertiary text-accent-cyan text-[11px]">
                            {children}
                          </span>
                        ),
                      }}
                    >
                      {log}
                    </ReactMarkdown>
                  </div>
                </div>
              );
            })}

            {/* Processing animation */}
            {isRunning && (
              <div className="flex gap-4 items-center pl-8">
                <div className="flex gap-1">
                  <span className="w-1 h-1 bg-accent-cyan animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1 h-1 bg-accent-cyan animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1 h-1 bg-accent-cyan animate-bounce" />
                </div>
                <p className="text-accent-cyan/60 italic text-xs font-mono">
                  Processing neural weights...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-bg-secondary border-t border-border-soft">
          <div className="relative flex items-end gap-2 bg-bg-primary rounded-xl border border-border-soft p-3 focus-within:border-accent-cyan/40 transition-all duration-300 group">
            {/* Left icon */}
            <div className="p-1.5 mb-1 text-text-disabled group-focus-within:text-accent-cyan transition-colors">
              <Cpu size={18} />
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={task}
              onChange={handleTaskInput}
              rows={1}
              placeholder="Send a directive to your agent..."
              className="w-full terminal-scroll py-2 px-1 bg-transparent text-text-primary placeholder:text-text-disabled focus:ring-0 outline-none font-mono text-sm resize-none max-h-48 overflow-y-auto leading-relaxed"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  toggleExecution();
                }
              }}
            />

            {/* Right — session count + button */}
            <div className="flex flex-col items-end gap-1.5 mb-1 shrink-0">
              {history.length > 0 && (
                <span className="text-[9px] font-mono text-accent-cyan/50 uppercase tracking-widest">
                  {history.length} msg
                </span>
              )}
              <button
                onClick={toggleExecution}
                disabled={!task.trim() || isRunning}
                className={`flex items-center justify-center h-9 w-9 rounded-lg transition-all duration-200 active:scale-90
                  ${
                    isRunning
                      ? "bg-bg-tertiary text-text-primary cursor-not-allowed border border-border-soft"
                      : "bg-accent-cyan text-bg-primary hover:brightness-110 disabled:opacity-20 disabled:bg-bg-tertiary disabled:text-text-disabled"
                  }`}
              >
                {isRunning ? (
                  <Square size={15} fill="currentColor" />
                ) : (
                  <Zap size={15} fill="currentColor" />
                )}
              </button>
            </div>
          </div>

          {/* Bottom hint */}
          <div className="mt-2 flex items-center justify-between px-1">
            <span className="text-[9px] text-text-disabled font-mono uppercase tracking-widest">
              ↵ send • shift+↵ newline
            </span>
            <span
              className={`text-[9px] font-mono uppercase tracking-widest ${
                isRunning
                  ? "text-accent-cyan animate-pulse"
                  : "text-text-disabled"
              }`}
            >
              {isRunning
                ? "● processing"
                : history.length > 0
                  ? "session_active"
                  : "ready"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentExecutor;
