"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAgentRuns } from "@/hooks/useAgents";
import {
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Calendar,
  Zap,
  CheckCircle,
  AlertCircle,
  Bot,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

type AgentRun = {
  id: string;
  agentId: string;
  task: string;
  response: string;
  createdAt: string;
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

// Detect if response is structured JSON
function tryParseJson(text: string): Record<string, unknown> | null {
  try {
    const t = text.trim();
    if (t.startsWith("{") || t.startsWith("[")) return JSON.parse(t);
  } catch {}
  return null;
}

function ResponseRenderer({ text }: { text: string }) {
  const parsed = tryParseJson(text);

  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    return (
      <div className="rounded-lg border border-accent-cyan/15 bg-bg-primary overflow-hidden mt-3">
        {Object.entries(parsed).map(([key, value]) => {
          const label = key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim();
          return (
            <div key={key} className="border-b border-border-soft/30 last:border-0">
              <div className="px-4 py-2 bg-bg-tertiary/40">
                <span className="text-[10px] font-mono font-bold text-accent-cyan uppercase tracking-widest">
                  {label}
                </span>
              </div>
              <div className="px-4 py-3 text-[12px] text-text-secondary leading-relaxed font-sans">
                {Array.isArray(value) ? (
                  <ul className="space-y-1">
                    {(value as string[]).map((item, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <span className="text-accent-cyan/50 shrink-0 mt-0.5">▸</span>
                        <span>{String(item)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="whitespace-pre-wrap">{String(value)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="mt-3 text-[12px] text-text-secondary leading-relaxed font-mono">
      <ReactMarkdown
        components={{
          p: ({ children }) => <span className="block mb-1">{children}</span>,
          ul: ({ children }) => <ul className="list-none space-y-1 mt-1">{children}</ul>,
          li: ({ children }) => (
            <li className="flex gap-2 items-start">
              <span className="text-accent-cyan/50 shrink-0">▸</span>
              <span>{children}</span>
            </li>
          ),
          strong: ({ children }) => (
            <span className="text-text-primary font-bold">{children}</span>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

function RunCard({ run, index, total }: { run: AgentRun; index: number; total: number }) {
  const [expanded, setExpanded] = useState(index === 0); // first run open by default
  const isScheduled = run.task === run.task; // all runs have a task — we flag scheduled ones by checking if the task matches the agent's scheduled task (simple heuristic: no user in context)

  return (
    <div className="relative">
      {/* Timeline line */}
      {index < total - 1 && (
        <div className="absolute left-[19px] top-10 bottom-0 w-px bg-border-soft/50" />
      )}

      <div className="flex gap-4">
        {/* Timeline dot */}
        <div className="flex flex-col items-center pt-1 shrink-0">
          <div className="w-10 h-10 flex items-center justify-center rounded-full border border-border-soft bg-bg-secondary z-10">
            <CheckCircle size={16} className="text-accent-cyan" />
          </div>
        </div>

        {/* Card */}
        <div className="flex-1 mb-6 rounded-xl border border-border-soft bg-bg-secondary overflow-hidden hover:border-border-strong transition-colors">
          {/* Card header */}
          <button
            className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 group"
            onClick={() => setExpanded((v) => !v)}
          >
            <div className="flex-1 min-w-0">
              {/* Task */}
              <p className="text-[12px] font-mono text-green-400 font-semibold leading-snug truncate">
                ▶ {run.task}
              </p>
              {/* Meta */}
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1 text-[10px] font-mono text-text-disabled">
                  <Clock size={9} />
                  {new Date(run.createdAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="text-[10px] font-mono text-text-disabled">·</span>
                <span className="text-[10px] font-mono text-text-disabled">
                  {timeAgo(run.createdAt)}
                </span>
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 text-[9px] font-mono text-accent-cyan uppercase tracking-widest">
                  <Zap size={8} />
                  Completed
                </span>
              </div>
            </div>

            <div className="shrink-0 text-text-muted group-hover:text-text-primary transition-colors">
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </button>

          {/* Expanded response */}
          {expanded && (
            <div className="px-5 pb-5 border-t border-border-soft/40">
              <p className="text-[10px] font-mono text-text-disabled uppercase tracking-widest mt-4 mb-1">
                Agent Response
              </p>
              <ResponseRenderer text={run.response ?? "No response recorded."} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AgentHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params?.id as string;

  const { data, isLoading, error, refetch } = useAgentRuns(agentId);
  const runs: AgentRun[] = data?.data ?? [];

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-border-soft bg-bg-secondary/80 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 font-mono text-[11px] text-text-muted hover:text-text-primary transition-colors uppercase tracking-widest"
            >
              <ArrowLeft size={13} />
              Back
            </button>
            <span className="text-border-soft">/</span>
            <span className="font-mono text-[11px] text-text-primary uppercase tracking-widest">
              Run History
            </span>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-1.5 font-mono text-[10px] text-text-muted hover:text-text-primary transition-colors uppercase tracking-widest disabled:opacity-30"
          >
            <RefreshCw size={11} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-[10px] text-accent-cyan uppercase tracking-[0.25em] mb-2">
            Execution Log
          </p>
          <h1 className="text-2xl font-bold font-display text-text-primary tracking-tight">
            Agent Run History
          </h1>
          {!isLoading && runs.length > 0 && (
            <p className="mt-1 font-mono text-[11px] text-text-muted">
              {runs.length} run{runs.length !== 1 ? "s" : ""} recorded
            </p>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-xl border border-border-soft bg-bg-secondary animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center h-48 gap-3 rounded-xl border border-red-500/20 bg-red-500/5">
            <AlertCircle size={28} className="text-red-400/50" />
            <p className="font-mono text-sm text-red-400 uppercase tracking-widest">
              Failed to load history
            </p>
            <button
              onClick={() => refetch()}
              className="font-mono text-[11px] text-text-muted hover:text-text-primary transition-colors uppercase tracking-widest"
            >
              [ Retry ]
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && runs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 gap-4 rounded-xl border border-dashed border-border-soft">
            <Bot size={36} className="text-text-disabled" />
            <p className="font-mono text-sm text-text-muted uppercase tracking-widest">
              No runs yet
            </p>
            <p className="font-mono text-[10px] text-text-disabled">
              Run this agent manually or wait for the scheduled execution
            </p>
            <Link
              href={`/runs?id=${agentId}`}
              className="font-mono text-[11px] text-accent-cyan uppercase tracking-widest hover:brightness-110 transition-colors"
            >
              [ Run Agent Now → ]
            </Link>
          </div>
        )}

        {/* Timeline */}
        {!isLoading && !error && runs.length > 0 && (
          <div>
            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total Runs", value: runs.length },
                {
                  label: "Last Run",
                  value: timeAgo(runs[0].createdAt),
                },
                {
                  label: "First Run",
                  value: new Date(runs[runs.length - 1].createdAt).toLocaleDateString(
                    undefined,
                    { month: "short", day: "numeric" },
                  ),
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg border border-border-soft bg-bg-secondary px-4 py-3"
                >
                  <p className="font-mono text-[9px] text-text-disabled uppercase tracking-widest mb-1">
                    {s.label}
                  </p>
                  <p className="font-mono text-[15px] font-bold text-text-primary">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Run cards */}
            <div>
              {runs.map((run, i) => (
                <RunCard key={run.id} run={run} index={i} total={runs.length} />
              ))}
            </div>

            {/* Bottom note */}
            <p className="text-center font-mono text-[10px] text-text-disabled mt-4 uppercase tracking-widest">
              <Calendar size={9} className="inline mr-1" />
              Showing last {runs.length} runs
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
