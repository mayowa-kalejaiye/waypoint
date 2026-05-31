"use client";

import { useRef } from "react";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import type { CurriculumProgress } from "@/types/curriculum";

interface ProgressSidebarProps {
  progress: CurriculumProgress;
  compact?: boolean;
  className?: string;
}

function ProgressRing({ progress, compact }: { progress: CurriculumProgress; compact: boolean }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progress.percent / 100) * circumference;

  return (
    <div className={`relative ${compact ? "h-24 w-24" : "h-[108px] w-[108px]"}`}>
      <svg className="h-full w-full -rotate-90" viewBox="0 0 108 108" aria-hidden="true">
        <circle cx="54" cy="54" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" />
        <motion.circle
          cx="54"
          cy="54"
          r={radius}
          stroke="var(--accent)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${compact ? "text-2xl" : "text-3xl"} font-display text-primary`}>{Math.round(progress.percent)}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">percent</span>
      </div>
    </div>
  );
}

export default function ProgressSidebar({ progress, compact = false, className = "" }: ProgressSidebarProps) {
  const sidebarRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sidebarRef,
    offset: ["start end", "end start"],
  });

  const floatY = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [14, 0, -10]), {
    stiffness: 110,
    damping: 24,
    mass: 0.9,
  });
  const floatScale = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [0.985, 1, 0.985]), {
    stiffness: 110,
    damping: 24,
    mass: 0.9,
  });
  const floatOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.88, 1, 1, 0.92]);

  const panelClassName = compact
    ? "w-full rounded-[28px] border border-subtle bg-[color:var(--surface)] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.28)]"
    : "w-full lg:w-[20rem] rounded-[28px] border border-subtle bg-[color:var(--surface)] p-5 shadow-[0_30px_70px_rgba(0,0,0,0.38)]";

  const remainingDays = Math.max(progress.totalDays - progress.completedDays, 0);

  return (
    <motion.aside
      ref={sidebarRef}
      className={className}
      style={prefersReducedMotion ? undefined : { y: floatY, scale: floatScale, opacity: floatOpacity }}
    >
      <motion.div
        className={panelClassName}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">Progress</p>
          <span className="inline-flex items-center gap-1 rounded-full border border-[color:rgba(200,254,2,0.18)] bg-[color:rgba(200,254,2,0.06)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--accent)]">
            <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.3} />
            Live
          </span>
        </div>

        <div className={`mt-6 ${compact ? "flex flex-col gap-5" : "flex items-center gap-5"}`}>
          <ProgressRing progress={progress} compact={compact} />

          <div className={compact ? "grid grid-cols-2 gap-3" : "space-y-4"}>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">Days completed</p>
              <p className="mt-1 text-2xl font-display text-primary">
                {progress.completedDays} / {progress.totalDays}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">Current streak</p>
              <p className="mt-1 text-2xl font-display text-primary">{progress.currentStreak}</p>
            </div>
          </div>
        </div>

        

        {(progress.totalProjects || 0) > 0 ? (
          <div className="mt-3 rounded-[20px] border border-subtle bg-[color:rgba(255,255,255,0.03)] p-4">
            <div className="flex items-center justify-between gap-2 text-muted">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em]">Project plan</p>
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--accent)]">
                {progress.completedProjects || 0}/{progress.totalProjects || 0}
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[color:#181818]">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(progress.totalProjects || 0) > 0 ? Math.round((((progress.completedProjects || 0) / (progress.totalProjects || 1)) * 100)) : 0}%`,
                }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="h-full rounded-full bg-[color:var(--accent)]"
              />
            </div>
          </div>
        ) : null}

        {/* <div className="mt-4 rounded-[22px] border border-subtle bg-[color:rgba(255,255,255,0.03)] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">Completion pace</p>
            <span className="inline-flex items-center gap-1 rounded-full border border-[color:rgba(200,254,2,0.16)] bg-[color:rgba(200,254,2,0.06)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--accent)]">
              <Flame className="h-3.5 w-3.5" strokeWidth={2.3} />
              {progress.percent}%
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[color:#181818]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress.percent}%` }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="h-full rounded-full bg-[color:var(--accent)]"
            />
          </div>
          <p className="mt-3 text-xs text-muted">
            {progress.remainingHours.toFixed(1)}h left in the path, updated as you mark lessons complete.
          </p>
        </div> */}
        <div className="mt-6 grid gap-3 border-t border-line pt-5 text-sm text-primary">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            <span>Estimated time remaining</span>
            <span>{progress.remainingHours.toFixed(1)}h</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[color:#181818]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress.percent}%` }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="h-full rounded-full bg-[color:var(--accent)]"
            />
          </div>
        </div>
      </motion.div>
    </motion.aside>
  );
}
