"use client";

import React from "react";
import { Cpu, Activity, Database, Network } from "lucide-react";

export default function HeroHeader({ userName }: { userName?: string | null }) {
  const firstName = userName ? userName.split(" ")[0] : "Commander";

  return (
    <div className="relative w-full rounded-2xl border border-border-strong bg-[#0c0c0c] overflow-hidden shadow-2xl">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-cyan/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 blur-[100px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative p-8 md:p-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-10">
        {/* Left: Greeting & Status */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan font-mono text-[10px] md:text-xs uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            Infrastructure Online
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">
            Welcome back, <span className="text-accent-cyan">{firstName}</span>.
          </h1>
          
          <p className="text-text-muted font-mono text-sm leading-relaxed max-w-xl">
            Your autonomous agent environment is operational. Provision new micro-services, assign tools, or review vector memory pipelines.
          </p>
        </div>

        {/* Right: Telemetry / Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-2 gap-6 md:gap-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-text-muted font-mono text-[10px] uppercase tracking-widest">
              <Cpu size={14} className="text-purple-400" /> Core Engine
            </div>
            <div className="text-2xl font-bold font-display text-white">Gemini 2.5</div>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-text-muted font-mono text-[10px] uppercase tracking-widest">
              <Database size={14} className="text-accent-cyan" /> Vector Store
            </div>
            <div className="text-2xl font-bold font-display text-white">ChromaDB</div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-text-muted font-mono text-[10px] uppercase tracking-widest">
              <Network size={14} className="text-green-400" /> Active Tools
            </div>
            <div className="text-2xl font-bold font-display text-white">Dynamic</div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-text-muted font-mono text-[10px] uppercase tracking-widest">
              <Activity size={14} className="text-yellow-400" /> Uptime
            </div>
            <div className="text-2xl font-bold font-display text-white">99.9%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
