"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface CanvasLoadingScreenProps {
  title?: string;
  statusMessage?: string;
  visible: boolean;
  progress?: number | null;
}

export default function CanvasLoadingScreen({ title = "Loading your results", statusMessage = "Please wait while we build the canvas", visible, progress = null }: CanvasLoadingScreenProps) {

  if (!visible) {
    return null;
  }

  const safeProgress = typeof progress === "number" && Number.isFinite(progress) ? Math.min(100, Math.max(0, progress)) : null;
  const progressLabel = safeProgress === null ? null : Math.round(safeProgress);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-[linear-gradient(180deg,#0a0a0a_0%,#070707_100%)] text-primary"
    >
      <div className="flex w-full max-w-xl flex-col items-center gap-4 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-6 py-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <Loader2 className="h-8 w-8 animate-spin text-[color:var(--accent)]" />
        <div className="space-y-2">
          <h1 className="font-display text-[clamp(1.9rem,3vw,3rem)] leading-tight text-primary">{title}</h1>
          <p className="text-sm leading-6 text-[color:var(--text-secondary)]">{statusMessage}</p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--text-muted)]">
          {progressLabel === null ? "Working" : `${progressLabel}% complete`}
        </p>
        {progressLabel !== null ? (
          <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
            <motion.div animate={{ width: `${progressLabel}%` }} transition={{ duration: 0.2, ease: "easeOut" }} className="h-full rounded-full bg-[color:var(--accent)]" />
          </div>
        ) : null}
        </div>
    </motion.div>
  );
}
