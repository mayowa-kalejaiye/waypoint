"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Clock3, Sparkles } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { GenerateCurriculumRequest, LearningLevel } from "@/types/curriculum";

interface WaypointInputProps {
  loading: boolean;
  compact?: boolean;
  onGenerate: (payload: GenerateCurriculumRequest) => void;
}

const LEVELS: { value: LearningLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const TEMPLATES = [
  "Build a portfolio website with React",
  "Learn data structures in Python",
  "Plan a content strategy for a product launch",
];

export default function WaypointInput({ loading, compact = false, onGenerate }: WaypointInputProps) {
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState<LearningLevel>("beginner");
  const [hoursPerDay, setHoursPerDay] = useState(1.5);
  const [preferLongVideos, setPreferLongVideos] = useState(true);
  const [levelOpen, setLevelOpen] = useState(false);
  const levelRef = useRef<HTMLDivElement | null>(null);

  const selectedLevel = useMemo(() => LEVELS.find((item) => item.value === level)?.label ?? "Beginner", [level]);

  return (
    <motion.form
      layout
      onSubmit={(event) => {
        event.preventDefault();
        if (!goal.trim()) {
          return;
        }
        onGenerate({ goal: goal.trim(), level, hours_per_day: hoursPerDay, prefer_long_videos: preferLongVideos });
      }}
      className={`w-full ${compact ? "max-w-3xl" : "max-w-4xl"}`}
    >
      <motion.div
        layout
        animate={compact ? { y: -24, scale: 0.985 } : { y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-[32px] border border-subtle bg-[color:rgba(17,17,17,0.88)] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_40px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-5 lg:p-6"
      >
        <div className="space-y-4 sm:space-y-5">
          <label className="sr-only" htmlFor="waypoint-goal">What do you want to learn?</label>
          <motion.div
            className="rounded-[28px] border border-subtle bg-[color:var(--surface)] p-4 focus-within:glow-accent"
          >
              <textarea
              id="waypoint-goal"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              placeholder="What do you want to learn?"
              rows={compact ? 2 : 3}
              disabled={loading}
                className="w-full resize-none bg-transparent text-xl font-display leading-tight text-primary placeholder:text-muted focus:outline-none sm:text-3xl"
            />
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-[0.3em] text-muted">
              <span>Goal</span>
              <span className="h-px flex-1 bg-line" />
              <motion.span
                animate={{ opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
              >
                {goal.length} chars
              </motion.span>
            </div>
          </motion.div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-3" ref={levelRef}>
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">Level</p>
              <div className="grid grid-cols-1 gap-2 rounded-[22px] border border-subtle bg-[color:var(--surface)] p-2 sm:grid-cols-3">
                {LEVELS.map((option) => {
                  const active = option.value === level;
                  return (
                    <motion.button
                      key={option.value}
                      type="button"
                      disabled={loading}
                      onClick={() => setLevel(option.value)}
                      whileHover={!loading ? { y: -1 } : undefined}
                      whileTap={!loading ? { scale: 0.98 } : undefined}
                      animate={active ? { boxShadow: ["0 0 0 0 rgba(200,254,2,0.14)", "0 0 0 10px rgba(200,254,2,0)"] } : {}}
                      transition={active ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
                      className={`focus-ring rounded-[18px] px-3 py-3 text-sm font-medium transition-transform ${active ? "bg-[color:var(--accent)] text-black" : "bg-transparent text-primary"}`}
                    >
                      {option.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-end justify-between gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">Hours per day</p>
                <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-primary">{hoursPerDay.toFixed(1)}h</p>
              </div>
              <div className="rounded-[22px] border border-subtle bg-[color:var(--surface)] px-4 py-4">
                <input
                  type="range"
                  min={0.5}
                  max={3}
                  step={0.5}
                  value={hoursPerDay}
                  onChange={(event) => setHoursPerDay(Number(event.target.value))}
                  disabled={loading}
                  style={{ accentColor: "var(--accent)" }}
                  className="h-2 w-full cursor-pointer"
                />
                <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                  <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>0.5</motion.span>
                  <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>3.0</motion.span>
                </div>
              </div>
            </div>
          </div>

            <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">Quick start</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {TEMPLATES.map((template) => (
                <motion.button
                  key={template}
                  type="button"
                  onClick={() => setGoal(template)}
                  disabled={loading}
                  whileHover={!loading ? { y: -1 } : undefined}
                  whileTap={!loading ? { scale: 0.99 } : undefined}
                  className="focus-ring rounded-[18px] border border-subtle bg-[color:#101010] px-3 py-3 text-left text-sm text-[color:#d8d8d8] transition-colors hover:border-[color:var(--accent)] hover:text-primary"
                >
                  {template}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.label
            layout
            whileHover={!loading ? { y: -1 } : undefined}
            className={`group block rounded-[24px] border border-subtle bg-[color:var(--surface)] p-4 transition-colors ${
              preferLongVideos ? "shadow-[0_0_0_1px_rgba(200,254,2,0.2),0_20px_50px_rgba(0,0,0,0.18)]" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">Video preference</p>
                  <span
                    className={`rounded-full border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.3em] transition-colors ${
                      preferLongVideos
                        ? "border-[color:rgba(200,254,2,0.35)] bg-[color:rgba(200,254,2,0.12)] text-[color:var(--accent)]"
                        : "border-subtle bg-[color:rgba(255,255,255,0.03)] text-muted"
                    }`}
                  >
                    {preferLongVideos ? "Enabled" : "Off"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-colors ${preferLongVideos ? "border-[color:rgba(200,254,2,0.35)] bg-[color:rgba(200,254,2,0.12)] text-[color:var(--accent)]" : "border-subtle bg-black/20 text-muted"}`}>
                    <Clock3 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">Prefer long-form videos</p>
                    <p className="mt-1 max-w-xl text-sm leading-6 text-muted">
                      Biases the planner toward in-depth videos, full tutorials, and 1h+ lessons when the topic has a good match.
                    </p>
                  </div>
                </div>
              </div>

              <span className={`relative mt-1 inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors ${preferLongVideos ? "border-[color:rgba(200,254,2,0.4)] bg-[color:rgba(200,254,2,0.18)]" : "border-subtle bg-[color:rgba(255,255,255,0.04)]"}`}>
                <input
                  type="checkbox"
                  checked={preferLongVideos}
                  onChange={(e) => setPreferLongVideos(e.target.checked)}
                  disabled={loading}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`inline-block h-5 w-5 rounded-full bg-[color:var(--surface)] shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-transform duration-200 ${
                    preferLongVideos ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </span>
            </div>
          </motion.label>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-[0.25em] text-muted">
            <span className="rounded-full border border-subtle bg-[color:rgba(255,255,255,0.03)] px-3 py-1">Best for deep dives</span>
            <span className="rounded-full border border-subtle bg-[color:rgba(255,255,255,0.03)] px-3 py-1">Downweights short clips</span>
            <span className="rounded-full border border-subtle bg-[color:rgba(255,255,255,0.03)] px-3 py-1">Can be changed per run</span>
          </div>

          <motion.button
            whileHover={!loading ? { y: -1, scale: 1.01 } : undefined}
            whileTap={!loading ? { scale: 0.99 } : undefined}
            animate={loading ? { opacity: 0.8 } : { boxShadow: ["0 0 0 0 rgba(200,254,2,0.14)", "0 0 0 12px rgba(200,254,2,0)"] }}
            transition={loading ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
            type="submit"
            disabled={loading || !goal.trim()}
            className="focus-ring flex w-full items-center justify-center gap-3 rounded-[999px] border border-[color:var(--accent)] bg-[color:var(--surface)] px-5 py-4 font-mono text-[12px] uppercase tracking-[0.35em] text-[color:var(--accent)] transition-colors hover:bg-[color:var(--accent)] hover:text-black disabled:cursor-not-allowed disabled:border-subtle disabled:text-muted"
          >
            <Sparkles className="h-4 w-4" />
            {loading ? "Generating" : "Generate curriculum"}
          </motion.button>

          <p className="text-center font-mono text-[9px] uppercase tracking-[0.28em] text-muted">
            Waypoint can make mistakes. Review the path before you start.
          </p>
        </div>
      </motion.div>
    </motion.form>
  );
}
