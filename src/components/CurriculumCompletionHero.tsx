"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import type { CurriculumProgress } from "@/types/curriculum";

interface CurriculumCompletionHeroProps {
  progress: CurriculumProgress;
  topic: string;
}

function CompletionOrb({ percent }: { percent: number }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (Math.min(Math.max(percent, 0), 100) / 100) * circumference;

  return (
    <div className="relative mx-auto h-44 w-44 sm:h-52 sm:w-52">
      <motion.div
        aria-hidden="true"
        className="absolute inset-7 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(200,254,2,0.26),transparent_54%),radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.08),transparent_62%)] blur-2xl"
        animate={{ scale: [1, 1.06, 1], opacity: [0.7, 0.95, 0.7] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg className="relative h-full w-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <linearGradient id="completion-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c8fe02" />
            <stop offset="100%" stopColor="#f5ffae" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          stroke="url(#completion-ring)"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.p
            key={Math.round(percent)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="font-display text-5xl leading-none text-primary sm:text-6xl"
          >
            {Math.round(percent)}%
          </motion.p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.38em] text-muted">complete</p>
        </div>
      </div>

      {[
        { top: "10%", left: "52%", delay: 0 },
        { top: "28%", left: "82%", delay: 0.18 },
        { top: "68%", left: "86%", delay: 0.35 },
        { top: "84%", left: "48%", delay: 0.52 },
        { top: "66%", left: "14%", delay: 0.7 },
        { top: "26%", left: "18%", delay: 0.88 },
      ].map((dot, index) => (
        <motion.span
          key={index}
          aria-hidden="true"
          className="absolute h-2.5 w-2.5 rounded-full bg-[color:var(--accent)] shadow-[0_0_18px_rgba(200,254,2,0.45)]"
          style={{ top: dot.top, left: dot.left }}
          animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: dot.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default function CurriculumCompletionHero({ progress, topic }: CurriculumCompletionHeroProps) {
  const remainingDays = Math.max(progress.totalDays - progress.completedDays, 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[32px] border border-subtle bg-[color:var(--surface)] p-5 shadow-[0_26px_80px_rgba(0,0,0,0.42)] sm:p-6"
    >
      <div className="absolute inset-0 opacity-70 [background:radial-gradient(circle_at_top_left,rgba(200,254,2,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_28%)]" />
      <div className="noise-layer absolute inset-0 pointer-events-none" />

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:rgba(200,254,2,0.28)] bg-[color:rgba(200,254,2,0.08)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.34em] text-[color:var(--accent)]">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.4} />
            Curriculum flow
          </div>

          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-muted">Completed videos</p>
            <h2 className="max-w-3xl font-display text-4xl leading-tight text-primary sm:text-5xl">
              {progress.completedDays} of {progress.totalDays} videos finished in {topic}
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-muted sm:text-base">
              The path is already tracking what you’ve completed, what’s left, and how far the current streak has carried you.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-subtle bg-[color:rgba(255,255,255,0.03)] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">Completed</p>
              <p className="mt-2 text-2xl font-display text-primary">{progress.completedDays}</p>
            </div>
            <div className="rounded-[22px] border border-subtle bg-[color:rgba(255,255,255,0.03)] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">Remaining</p>
              <p className="mt-2 text-2xl font-display text-primary">{remainingDays}</p>
            </div>
            <div className="rounded-[22px] border border-subtle bg-[color:rgba(255,255,255,0.03)] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted">Streak</p>
              <p className="mt-2 text-2xl font-display text-primary">{progress.currentStreak}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-muted">
            <span className="rounded-full border border-subtle bg-[color:rgba(255,255,255,0.03)] px-3 py-2">{progress.percent}% complete</span>
            <span className="rounded-full border border-subtle bg-[color:rgba(255,255,255,0.03)] px-3 py-2">{progress.remainingHours.toFixed(1)}h remaining</span>
            <span className="rounded-full border border-subtle bg-[color:rgba(255,255,255,0.03)] px-3 py-2">Videos completed update live</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[color:#181818]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress.percent}%` }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="h-full rounded-full bg-[color:var(--accent)] shadow-[0_0_22px_rgba(200,254,2,0.24)]"
            />
          </div>
        </div>

        <div className="relative flex items-center justify-center lg:justify-end">
          <CompletionOrb percent={progress.percent} />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-4 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,254,2,0.18),transparent_65%)] blur-xl"
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[color:rgba(200,254,2,0.24)] bg-[color:rgba(10,10,10,0.8)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-primary backdrop-blur">
            <CheckCircle2 className="h-3.5 w-3.5 text-[color:var(--accent)]" strokeWidth={2.5} />
            Tracking completed videos
          </div>
        </div>
      </div>
    </motion.section>
  );
}
