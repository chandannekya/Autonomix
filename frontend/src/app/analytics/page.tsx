"use client";

import { useAnalytics } from "@/hooks/useAgents";
import { BarChart2, TrendingUp, Users, Activity, CheckCircle, Clock, RefreshCw } from "lucide-react";

export default function AnalyticsPage() {
  const { data: analytics, isLoading, isError, refetch } = useAnalytics();

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto w-full font-mono flex items-center justify-center h-64 text-text-disabled animate-pulse uppercase tracking-widest">
        Fetching System Telemetry...
      </div>
    );
  }

  if (isError || !analytics) {
    return (
      <div className="p-8 max-w-6xl mx-auto w-full font-mono flex flex-col items-center justify-center h-64 gap-4 text-red-400">
        <p className="uppercase tracking-widest">Failed to load telemetry</p>
        <button onClick={() => refetch()} className="text-[10px] text-text-muted hover:text-text-primary transition-colors border border-border-soft px-3 py-1 rounded">
          [ Retry ]
        </button>
      </div>
    );
  }

  const { totalRuns, activeAgents, totalAgents, chartData } = analytics;

  // Find max value for scaling the chart
  const maxRuns = Math.max(...chartData.map((d: any) => d.count), 1); // min 1 to avoid division by zero

  const stats = [
    { label: "Total Runs", value: totalRuns.toLocaleString(), change: "+All Time", icon: Activity },
    { label: "Active Agents", value: activeAgents.toString(), change: `${activeAgents}/${totalAgents} Deployed`, icon: Users },
    { label: "Success Rate", value: "100%", change: "Steady", icon: CheckCircle }, // Hardcoded for now as failures aren't tracked explicitly yet
    { label: "Avg Execution Time", value: "3.2s", change: "Fast", icon: Clock }, // Placeholder
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto w-full font-mono">
      <div className="mb-8 border-b border-border-soft pb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary uppercase tracking-widest flex items-center gap-3">
            <BarChart2 className="text-accent-cyan" />
            System Analytics
          </h1>
          <p className="text-text-muted mt-3 text-sm max-w-3xl leading-relaxed">
            Monitor agent performance, usage, and execution metrics across all your autonomous workflows.
          </p>
        </div>
        <button 
          onClick={() => refetch()} 
          className="text-text-disabled hover:text-accent-cyan transition-colors"
          title="Refresh Data"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-bg-secondary border border-border-soft rounded-lg p-6 relative overflow-hidden group hover:border-accent-cyan/50 transition-colors shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="text-text-muted">
                <stat.icon size={20} className="group-hover:text-accent-cyan transition-colors" />
              </div>
              <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full ${i === 2 ? 'text-green-400 bg-green-400/10 border border-green-400/20' : 'text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-xs text-text-disabled uppercase tracking-widest font-semibold mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-text-primary tracking-wider">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Chart Area */}
      <div className="bg-bg-secondary border border-border-soft rounded-lg p-6 relative overflow-hidden shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <h3 className="text-sm font-bold text-text-primary tracking-widest uppercase flex items-center gap-2">
            <TrendingUp size={16} className="text-accent-cyan" />
            Execution Volume (30 Days)
          </h3>
          <div className="bg-bg-tertiary border border-border-soft rounded text-[10px] text-text-muted px-3 py-1 outline-none tracking-widest uppercase">
            Last 30 Days
          </div>
        </div>
        
        {/* Real Data Chart Grid */}
        <div className="h-64 flex items-end justify-between gap-1 sm:gap-2 border-l border-b border-border-soft/50 pl-2 pb-2 pt-4 relative mt-10">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-[10px] text-text-disabled pb-2 -ml-8 text-right pr-2 font-mono">
            <span>{maxRuns}</span>
            <span>{Math.round(maxRuns * 0.75)}</span>
            <span>{Math.round(maxRuns * 0.5)}</span>
            <span>{Math.round(maxRuns * 0.25)}</span>
            <span>0</span>
          </div>
          
          {chartData.map((d: any, i: number) => {
            const height = Math.max((d.count / maxRuns) * 100, 5); // 5% minimum height for visibility
            const isToday = i === chartData.length - 1;
            
            return (
              <div key={d.date} className="w-full flex justify-center group relative h-full items-end pb-0.5">
                <div 
                  className={`w-full max-w-[12px] rounded-t-sm transition-all duration-500 ease-out 
                    ${isToday ? 'bg-accent-cyan/80' : 'bg-accent-cyan/20'} 
                    group-hover:bg-accent-cyan`} 
                  style={{ height: `${d.count === 0 ? 0 : height}%` }}
                ></div>
                {/* Tooltip on hover */}
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-bg-tertiary border border-border-soft text-[10px] text-text-primary px-2 py-1 rounded shadow-lg transition-opacity whitespace-nowrap z-10 font-mono tracking-widest pointer-events-none flex flex-col items-center">
                  <span className="text-accent-cyan font-bold">{d.count} Runs</span>
                  <span className="text-[9px] text-text-muted mt-0.5">{new Date(d.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
