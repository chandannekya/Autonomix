"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Trash2,
  Wrench,
  Brain,
  Zap,
  Clock,
  Calendar,
  RotateCcw,
  X,
  AlarmClock,
  Loader2,
  AlertCircle,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAgentStore } from "@/store/useAgentStore";
import { useQueryClient } from "@tanstack/react-query";
import { createPortal } from "react-dom";
import { useScheduleAgent, useDeleteSchedule } from "../../hooks/useAgents";

// ─── Types ────────────────────────────────────────────────────────────────────

type CardData = {
  id: string;
  name: string;
  role: string;
  memoryEnabled: boolean;
  tools: string[];
  status?: string; // "active" | "paused" — from backend
  task?: string | null;
  scheduleCron?: string | null;
  nextRunAt?: string | Date | null;
};

type CardProps = { cardData: CardData };

type Draft = { task: string; time: string };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isValidTime(time: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(time)) return false;
  const [h, m] = time.split(":").map(Number);
  return h >= 0 && h < 24 && m >= 0 && m < 60;
}

// Build a UTC cron from local HH:mm input.
// JS getTimezoneOffset() returns minutes *behind* UTC (negative for east).
function buildUtcCron(localTime: string): string {
  const [localH, localM] = localTime.split(":").map(Number);
  const offsetMinutes = -new Date().getTimezoneOffset(); // e.g. +330 for IST
  const totalLocal = localH * 60 + localM;
  const totalUtc = (((totalLocal - offsetMinutes) % 1440) + 1440) % 1440;
  return `${totalUtc % 60} ${Math.floor(totalUtc / 60)} * * *`;
}

// Derive local HH:mm from nextRunAt (a proper UTC ISO timestamp from the DB).
// This is always correct — no cron parsing needed.
function nextRunAtToLocalTime(nextRunAt?: string | Date | null): string {
  if (!nextRunAt) return "";
  try {
    const d = new Date(nextRunAt);
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  } catch {
    return "";
  }
}

function formatNextRun(nextRunAt?: string | Date | null): string | null {
  if (!nextRunAt) return null;
  try {
    return new Date(nextRunAt).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
}

// ─── Schedule Modal ───────────────────────────────────────────────────────────

interface ScheduleModalProps {
  agentName: string;
  cardData: CardData;
  draft: Draft;
  onDraftChange: (d: Draft) => void;
  onClose: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
  isScheduling: boolean;
  isDeactivating: boolean;
  scheduleError: string | null;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  agentName,
  cardData,
  draft,
  onDraftChange,
  onClose,
  onActivate,
  onDeactivate,
  isScheduling,
  isDeactivating,
  scheduleError,
}) => {
  if (typeof document === "undefined") return null;

  const isPending = isScheduling || isDeactivating;
  const isScheduled = cardData.status === "active" && !!cardData.scheduleCron;
  const isReady =
    draft.task.trim().length > 0 && isValidTime(draft.time) && !isPending;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, isPending]);

  const nextRunFormatted = formatNextRun(cardData.nextRunAt);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPending) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md rounded-xl border border-border-strong bg-bg-secondary shadow-2xl overflow-hidden"
        style={{
          boxShadow:
            "0 0 0 1px rgba(0,255,255,0.08), 0 32px 64px rgba(0,0,0,0.6)",
        }}
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-accent-cyan/50 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-accent-cyan/30 bg-accent-cyan/10">
              <AlarmClock size={15} className="text-accent-cyan" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
                Schedule Agent
              </p>
              <h2 className="text-sm font-bold font-mono text-text-primary leading-tight">
                {agentName}
              </h2>
            </div>
          </div>
          <button
            onClick={() => !isPending && onClose()}
            disabled={isPending}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border-soft text-text-muted hover:text-text-primary hover:border-border-strong transition-all disabled:opacity-30"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-[10px] font-mono text-text-muted uppercase tracking-widest mb-2">
              Task / Prompt
            </label>
            <textarea
              rows={3}
              value={draft.task}
              onChange={(e) => onDraftChange({ ...draft, task: e.target.value })}
              placeholder={`What should ${agentName} do when triggered?`}
              className="w-full resize-none rounded-lg border border-border-soft bg-bg-tertiary text-[12px] font-mono text-text-primary placeholder:text-text-disabled px-4 py-3 outline-none focus:border-accent-cyan/50 transition-colors no-scrollbar"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-text-muted uppercase tracking-widest mb-2">
              Run At (your local time)
            </label>
            <div className="relative">
              <Calendar
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
              <input
                type="time"
                value={draft.time}
                onChange={(e) => onDraftChange({ ...draft, time: e.target.value })}
                className="w-full rounded-lg border border-border-soft bg-bg-tertiary text-[12px] font-mono text-text-primary pl-9 pr-4 py-3 outline-none focus:border-accent-cyan/50 transition-colors [color-scheme:dark]"
              />
            </div>
            <p className="mt-1.5 flex items-center gap-1 text-[10px] font-mono text-text-muted">
              <Info size={10} className="shrink-0" />
              Your local time — agent will run daily at this time
            </p>
          </div>

          {/* Current schedule from backend — only shown when truly active */}
          {isScheduled && (
            <div className="flex items-start gap-3 rounded-lg border border-accent-cyan/20 bg-accent-cyan/5 px-4 py-3">
              <Clock size={13} className="text-accent-cyan mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-mono text-accent-cyan uppercase tracking-widest mb-0.5">
                  Currently Scheduled
                </p>
                <p className="text-[11px] font-mono text-text-primary">
                  {cardData.task}
                </p>
                {nextRunFormatted && (
                  <p className="text-[10px] font-mono text-text-muted mt-0.5">
                    Next run: {nextRunFormatted}
                  </p>
                )}
              </div>
            </div>
          )}

          {scheduleError && (
            <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
              <AlertCircle size={13} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-[11px] font-mono text-red-400 break-all">
                {scheduleError}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          {isScheduled ? (
            <>
              {/* Deactivate — spinner only when deactivating */}
              <button
                type="button"
                onClick={onDeactivate}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 py-2.5 text-[11px] font-mono font-bold text-red-400 uppercase tracking-widest hover:bg-red-500/20 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {isDeactivating ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <X size={13} />
                )}
                {isDeactivating ? "Saving…" : "Deactivate"}
              </button>
              {/* Update — spinner only when scheduling */}
              <button
                type="button"
                onClick={onActivate}
                disabled={!isReady || isPending}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-accent-cyan py-2.5 text-[11px] font-mono font-bold text-bg-primary uppercase tracking-widest hover:brightness-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {isScheduling ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <RotateCcw size={13} />
                )}
                {isScheduling ? "Saving…" : "Update"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="flex-1 flex items-center justify-center rounded-lg border border-border-soft bg-transparent py-2.5 text-[11px] font-mono text-text-muted uppercase tracking-widest hover:text-text-primary hover:border-border-strong active:scale-95 disabled:opacity-30 transition-all"
              >
                Cancel
              </button>
              {/* Activate — spinner only when scheduling */}
              <button
                type="button"
                onClick={onActivate}
                disabled={!isReady || isPending}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-accent-cyan py-2.5 text-[11px] font-mono font-bold text-bg-primary uppercase tracking-widest hover:brightness-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {isScheduling ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Clock size={13} />
                )}
                {isScheduling ? "Saving…" : "Activate Schedule"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

// ─── Agent Card ───────────────────────────────────────────────────────────────

const ExampleCard: React.FC<CardProps> = ({ cardData }) => {
  const router = useRouter();
  const setActiveAgent = useAgentStore((state) => state.setActiveAgent);
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>({ task: "", time: "" });
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const confirmTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { mutate: scheduleAgent, isPending: isScheduling } = useScheduleAgent();
  const { mutate: deleteSchedule, isPending: isDeactivating } = useDeleteSchedule();
  const isPending = isScheduling || isDeactivating;

  // Backend is source of truth — derive schedule state from cardData directly
  const isScheduled = cardData.status === "active" && !!cardData.scheduleCron;

  const onRunHandle = () => {
    setActiveAgent(cardData);
    router.push(`/runs?id=${cardData.id}`);
  };

  const openModal = () => {
    setScheduleError(null);
    // Use nextRunAt (UTC ISO timestamp) to derive local time — always accurate
    const localTime = nextRunAtToLocalTime(cardData.nextRunAt);
    setDraft({ task: cardData.task ?? "", time: localTime });
    setModalOpen(true);
  };

  const handleActivate = () => {
    setScheduleError(null);
    scheduleAgent(
      {
        id: cardData.id,
        task: draft.task.trim(),
        scheduleCron: buildUtcCron(draft.time),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["agents"] });
          setModalOpen(false);
        },
        onError: (err) => {
          setScheduleError(
            err instanceof Error
              ? err.message
              : "Failed to schedule agent. Please try again.",
          );
        },
      },
    );
  };

  const handleDeactivate = () => {
    setScheduleError(null);
    deleteSchedule(
      { id: cardData.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["agents"] });
          setModalOpen(false);
        },
        onError: (err: unknown) => {
          setScheduleError(
            err instanceof Error
              ? err.message
              : "Failed to deactivate schedule. Please try again.",
          );
        },
      },
    );
  };

  const onDeleteHandle = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setDeleteError(null);
      confirmTimeout.current = setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    if (confirmTimeout.current) clearTimeout(confirmTimeout.current);
    setConfirmDelete(false);
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/agents/${cardData.id}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(body || `Server error ${res.status}`);
      }
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    } catch (e) {
      setDeleteError(
        e instanceof Error ? e.message : "Failed to delete agent. Please try again.",
      );
      setDeleting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (confirmTimeout.current) clearTimeout(confirmTimeout.current);
    };
  }, []);

  return (
    <>
      <div className="group relative flex h-full flex-col rounded-lg border border-border-soft bg-bg-secondary p-5 font-mono text-text-primary transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-2xl overflow-hidden">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at top, rgba(0,255,255,0.03) 0%, transparent 70%)",
          }}
        />

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          </div>
          <div className="flex items-center gap-2">
            {/* Badge driven by backend data, not local state */}
            {isScheduled && (
              <span className="flex items-center gap-1 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-2 py-0.5 text-[9px] font-medium text-accent-cyan uppercase tracking-widest">
                <Clock size={8} className="animate-pulse" />
                Scheduled
              </span>
            )}
            {cardData.memoryEnabled && (
              <span className="flex items-center gap-1 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 px-2 py-0.5 text-[9px] font-medium text-accent-cyan uppercase tracking-widest">
                <Brain size={9} />
                Memory
              </span>
            )}
          </div>
        </div>

        {/* Avatar */}
        <div className="mb-4 flex h-28 w-full items-center justify-center rounded-md bg-bg-tertiary border border-border-soft relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border-strong bg-bg-secondary text-xl font-bold text-text-primary group-hover:border-accent-cyan/40 transition-colors">
              {cardData.name.charAt(0).toUpperCase()}
            </div>
            <Zap
              size={10}
              className="text-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"
            />
          </div>
        </div>

        <h2 className="mb-1 text-sm font-bold leading-tight tracking-wide text-text-primary group-hover:text-accent-cyan transition-colors">
          {cardData.name}
        </h2>
        <p className="mb-4 flex-grow text-xs leading-relaxed text-text-muted line-clamp-2">
          {cardData.role}
        </p>

        {cardData.tools.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {cardData.tools.map((tool) => (
              <span
                key={tool}
                className="flex items-center gap-1 rounded border border-border-soft bg-bg-tertiary px-1.5 py-0.5 text-[9px] text-text-muted uppercase tracking-widest"
              >
                <Wrench size={8} />
                {tool.replace("_", " ")}
              </span>
            ))}
          </div>
        )}

        <div className="h-px bg-border-soft mb-4" />

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRunHandle}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-accent-cyan py-2.5 text-bg-primary font-bold text-[11px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
          >
            <Play size={13} fill="currentColor" />
            Run Agent
          </button>

          <button
            type="button"
            onClick={openModal}
            title={isScheduled ? "Edit schedule" : "Schedule this agent"}
            className={`flex items-center justify-center gap-1.5 rounded-md border px-3 py-2.5 text-[10px] uppercase tracking-widest transition-all active:scale-95 ${isScheduled
              ? "border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan"
              : "border-border-soft bg-transparent text-text-muted hover:border-border-strong hover:text-text-primary"
              }`}
          >
            <Calendar size={13} />
          </button>

          <button
            type="button"
            onClick={onDeleteHandle}
            disabled={deleting}
            title={confirmDelete ? "Click again to confirm" : "Delete agent"}
            className={`flex items-center justify-center rounded-md border px-3 py-2.5 text-[10px] transition-all active:scale-95 disabled:opacity-30 ${confirmDelete
              ? "border-red-500/60 bg-red-500/20 text-red-400"
              : "border-border-soft bg-transparent text-text-muted hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
              }`}
          >
            {deleting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        </div>

        {confirmDelete && (
          <p className="mt-2 text-center text-[9px] font-mono text-red-400 animate-pulse">
            Click delete again to confirm
          </p>
        )}

        {deleteError && (
          <div className="mt-2 flex items-start gap-1.5 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2">
            <AlertCircle size={11} className="text-red-400 shrink-0 mt-px" />
            <p className="text-[10px] font-mono text-red-400 break-all">
              {deleteError}
            </p>
          </div>
        )}
      </div>

      {modalOpen && (
        <ScheduleModal
          agentName={cardData.name}
          cardData={cardData}
          draft={draft}
          onDraftChange={setDraft}
          onClose={() => setModalOpen(false)}
          onActivate={handleActivate}
          onDeactivate={handleDeactivate}
          isScheduling={isScheduling}
          isDeactivating={isDeactivating}
          scheduleError={scheduleError}
        />
      )}
    </>
  );
};

export default ExampleCard;
