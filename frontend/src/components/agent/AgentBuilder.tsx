"use client";

import React, { useRef, useState } from "react";
import {
  SquareDashedBottomCode,
  HatGlasses,
  Play,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCreateAgent } from "@/hooks/useAgents";

const AgentBuilderText = {
  version: "Agent Builder v1.0",
  placeholder_name: "Give your agent a name...",
  placeholder_goal: "Create a new agent with specific goals...",
};

const ColorButtons = () => (
  <div className="flex gap-2">
    <span className="h-3 w-3 rounded-full bg-red-500" />
    <span className="h-3 w-3 rounded-full bg-yellow-500" />
    <span className="h-3 w-3 rounded-full bg-green-500" />
  </div>
);

interface AgentBuilderProps {
  defaultName?: string;
  defaultGoal?: string;
}

const AgentBuilder: React.FC<AgentBuilderProps> = ({ defaultName = "", defaultGoal = "" }) => {
  const [goal, setGoal] = useState(defaultGoal);
  const [name, setName] = useState(defaultName);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (defaultName) setName(defaultName);
    if (defaultGoal) {
      setGoal(defaultGoal);
      setTimeout(() => {
        const ta = textareaRef.current;
        if (ta) {
          ta.style.height = "auto";
          ta.style.height = Math.min(ta.scrollHeight, 100) + "px";
        }
      }, 0);
    }
  }, [defaultName, defaultGoal]);

  const queryClient = useQueryClient();
  const router = useRouter();

  // ✅ Fixed: onSuccess and onError passed into mutate options
  const { mutate } = useCreateAgent({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] }); // ✅ list will be fresh
      setStatus("success");
      setGoal("");
      setName("");
      setTimeout(() => {
        setStatus("idle");
        router.push("/agents"); // ✅ auto-navigate to see the new agent
      }, 1500);
    },
  });

  const handleGoalInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGoal(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 130) + "px";
    }
  };

  // ✅ Fixed: React.FormEvent instead of React.SubmitEvent
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!goal.trim() || !name.trim() || status === "loading") return;

    setStatus("loading");

    mutate(
      { agent_name: name, goal },
      {
        onSuccess: () => {
          setStatus("success");
          setGoal("");
          setName("");
          if (textareaRef.current) textareaRef.current.style.height = "auto";
          // Reset back to idle after 3 seconds
          setTimeout(() => setStatus("idle"), 3000);
        },
        onError: () => {
          setStatus("error");
          setTimeout(() => setStatus("idle"), 3000);
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isDisabled = !name.trim() || !goal.trim() || status === "loading";

  return (
    <div className="w-full h-full rounded-2xl border border-border-strong bg-[#0c0c0c] p-4 md:p-5 shadow-xl relative overflow-hidden flex flex-col">
      {/* Subtle top glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-4">
          <ColorButtons />
          <h2 className="text-sm font-mono text-text-secondary">
            {AgentBuilderText.version}
          </h2>
        </div>

        {/* ✅ Status badge */}
        {status === "success" && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-green-400">
            <CheckCircle size={13} />
            AGENT_DEPLOYED
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-red-400">
            <AlertCircle size={13} />
            DEPLOY_FAILED
          </div>
        )}
        {status === "loading" && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-accent-cyan">
            <Loader2 size={13} className="animate-spin" />
            INITIALIZING...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">

        {/* Spacer at TOP — compresses as textarea grows, so growth goes upward */}
        <div className="flex-1" />

        {/* Agent Name */}
        <div className="relative mb-3">
          <HatGlasses className="absolute left-3 top-4 text-text-secondary" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={AgentBuilderText.placeholder_name}
            disabled={status === "loading"}
            className="w-full pl-12 pr-4 py-4 rounded-md border border-border-strong bg-bg-tertiary text-text-primary placeholder:text-text-secondary outline-none font-mono disabled:opacity-50 focus:border-accent-cyan/50 transition-colors"
          />
        </div>

        {/* Agent Goal — grows upward, scrolls after max */}
        <div className="relative mb-4">
          <SquareDashedBottomCode
            size={22}
            className="absolute left-3 top-4 text-text-secondary z-10"
          />
          <textarea
            ref={textareaRef}
            value={goal}
            onChange={handleGoalInput}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={AgentBuilderText.placeholder_goal}
            disabled={status === "loading"}
            style={{ maxHeight: "130px" }}
            className="w-full pl-12 pr-4 py-4 rounded-md border border-border-strong bg-bg-tertiary text-text-primary placeholder:text-text-secondary resize-none overflow-y-auto outline-none font-mono disabled:opacity-50 focus:border-accent-cyan/50 transition-colors no-scrollbar"
          />
        </div>

        {/* Deploy button — always at the bottom */}
        <div className="flex flex-col items-center gap-2">
          <button
            type="submit"
            disabled={isDisabled}
            className="flex items-center gap-2 px-8 py-3 rounded-md bg-accent-cyan text-bg-primary font-mono text-sm font-bold tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {status === "loading" ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deploying...
              </>
            ) : (
              <>
                <Play size={16} fill="currentColor" />
                Deploy Agent
              </>
            )}
          </button>
          <p className="text-center text-[10px] font-mono text-text-disabled uppercase tracking-widest">
            Shift + Enter for new line • Enter to deploy
          </p>
        </div>
      </form>
    </div>
  );
};

export default AgentBuilder;
