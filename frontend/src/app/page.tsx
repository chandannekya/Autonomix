"use client";

import React, { useState, useEffect, useRef } from "react";
import AgentBuilder from "@/components/agent/AgentBuilder";
import { useSession } from "next-auth/react";
import { Cpu, Zap, ShieldCheck, ArrowRight, Newspaper, Mail, Github, BarChart2, Cloud, Calendar } from "lucide-react";

const EXAMPLES = [
  {
    icon: <Newspaper size={16} className="text-accent-cyan" />,
    label: "Morning Briefing",
    name: "Morning Digest",
    goal: "Every morning at 7am, fetch the top technology news headlines and the daily weather forecast for my city. Summarize the news and send the digest to my email.",
    tag: "Daily",
  },
  {
    icon: <BarChart2 size={16} className="text-yellow-400" />,
    label: "Stock Alerts",
    name: "Portfolio Tracker",
    goal: "Every weekday at 4pm, check the current stock prices for AAPL, MSFT, and TSLA. Calculate the daily percentage change and email me a formatted financial summary.",
    tag: "Finance",
  },
  {
    icon: <Cloud size={16} className="text-blue-400" />,
    label: "Weather & Agenda",
    name: "Daily Planner",
    goal: "Every morning at 6am, fetch my Google Calendar events for the day and the local weather forecast. Email me a clean daily schedule along with clothing recommendations based on the weather.",
    tag: "Productivity",
  },
  {
    icon: <Newspaper size={16} className="text-accent-purple" />,
    label: "PDF Research Report",
    name: "Research Assistant",
    goal: "Search the web for the latest advancements in artificial intelligence. Summarize the top findings into a comprehensive research report, generate a downloadable PDF, and email me the link.",
    tag: "Research",
  },
  {
    icon: <Mail size={16} className="text-accent-green" />,
    label: "Competitor Watch",
    name: "Market Analyst",
    goal: "Once a week, search for recent news articles mentioning OpenAI and Anthropic. Compile a brief analysis of their recent activities and email me the intelligence summary.",
    tag: "Business",
  },
];

export default function Page() {
  const { data: session } = useSession();
  const [tick, setTick] = useState(true);
  const [selected, setSelected] = useState<{ name: string; goal: string } | null>(null);
  const builderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setTick(p => !p), 800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden relative selection:bg-accent-cyan/20">

      {/* ── DOT GRID BACKGROUND ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `radial-gradient(circle, var(--color-border-strong) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_80%_70%_at_50%_20%,transparent_10%,var(--color-bg-primary)_85%)]" />
      <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[500px] h-[280px] bg-accent-cyan/8 blur-[90px] rounded-full pointer-events-none z-0" />

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 flex flex-col h-full w-full max-w-[960px] mx-auto px-4 md:px-8 py-4 md:py-5 gap-4 overflow-hidden">

        {/* HERO */}
        <div className="flex flex-col items-center text-center gap-2 shrink-0">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-secondary border border-border-soft text-[10px] font-mono text-text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              <Cpu size={10} className="text-accent-cyan" /> Gemini 2.5 · Online
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-secondary border border-border-soft text-[10px] font-mono text-text-muted">
              <ShieldCheck size={10} className="text-accent-green" />
              {session?.user?.name ?? "Guest"} · Authenticated
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-secondary border border-border-soft text-[10px] font-mono text-text-muted">
              <Zap size={10} className="text-accent-purple" /> Tools · Dynamic
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary leading-tight tracking-tight">
            Build your next{" "}
            <span className="relative inline-block">
              <span className="text-accent-cyan">agent</span>
              <span
                className="absolute -bottom-0.5 left-0 h-[2px] bg-accent-cyan transition-all duration-500 rounded-full"
                style={{ width: tick ? "100%" : "55%" }}
              />
            </span>
          </h1>
          <p className="text-xs text-text-muted font-mono max-w-md mx-auto leading-relaxed">
            Pick a template or describe your own. AutonomiX provisions an agent that works for you — even while you sleep.
          </p>
        </div>

        {/* HORIZONTAL CARD STRIP */}
        <div className="shrink-0 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-text-disabled uppercase tracking-widest whitespace-nowrap">Quick Start</span>
            <div className="flex-1 h-px bg-border-soft" />
          </div>
          <div className="flex gap-3  pb-1 no-scrollbar">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => setSelected({ name: ex.name, goal: ex.goal })}
                className={`group shrink-0 text-left p-3 rounded-xl border transition-all duration-200 flex flex-col gap-2 w-[175px] ${selected?.name === ex.name
                    ? "border-accent-cyan/50 bg-bg-tertiary"
                    : "border-border-soft bg-bg-secondary hover:border-border-strong hover:bg-bg-tertiary"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-bg-primary border border-border-soft">{ex.icon}</div>
                  <span className="text-[9px] font-mono text-text-disabled bg-bg-primary border border-border-soft px-1.5 py-0.5 rounded-full">{ex.tag}</span>
                </div>
                <p className="text-xs font-display font-semibold text-text-primary">{ex.label}</p>
                <div className="flex items-center gap-1 text-[10px] font-mono text-text-disabled group-hover:text-accent-cyan transition-colors">
                  Use this <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* AGENT BUILDER — fills remaining height */}
        <div ref={builderRef} className="flex-1 min-h-0 flex flex-col gap-2">
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[10px] font-mono text-text-disabled uppercase tracking-widest">
              {selected ? "Template loaded — feel free to edit" : "Or describe your own"}
            </span>
            <div className="flex-1 h-px bg-border-soft" />
            {selected && (
              <button
                onClick={() => setSelected(null)}
                className="text-[10px] font-mono text-text-disabled hover:text-text-muted transition-colors"
              >
                clear ✕
              </button>
            )}
          </div>
          <div className="relative flex-1 min-h-0">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-accent-cyan/10 to-transparent blur-sm pointer-events-none" />
            <div className="relative h-full overflow-y-auto no-scrollbar">
              <AgentBuilder
                defaultName={selected?.name ?? ""}
                defaultGoal={selected?.goal ?? ""}
              />
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
