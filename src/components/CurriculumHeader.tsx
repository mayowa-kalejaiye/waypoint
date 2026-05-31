"use client";

import { motion } from "framer-motion";
import type { LearningLevel } from "@/types/curriculum";

interface CurriculumHeaderProps {
  topic: string;
  description?: string;
  levelLabel: string;
  daysLabel: string;
  hoursLabel: string;
  activeLevel: LearningLevel;
  onBack: () => void;
  onChangeLevel: (level: LearningLevel) => void;
  onDelete?: () => void;
  switchingLevel?: LearningLevel | null;
}

const LEVELS: Array<{ value: LearningLevel; label: string }> = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export default function CurriculumHeader({
  topic,
  description,
  levelLabel,
  daysLabel,
  hoursLabel,
  activeLevel,
  onBack,
  onDelete,
  onChangeLevel,
  switchingLevel,
}: CurriculumHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="sticky top-0 z-40 border-b border-subtle bg-[color:rgba(10,10,10,0.82)] backdrop-blur-xl"
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-subtle bg-[color:var(--surface)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.35em] text-primary transition-colors hover:border-[color:var(--accent)]"
          >
            <span aria-hidden="true">←</span>
            Back to home
          </button>

          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="focus-ring ml-2 inline-flex items-center gap-2 rounded-full border border-red-600 bg-[color:rgba(255,40,40,0.06)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.35em] text-red-400 transition-colors hover:bg-[color:rgba(255,40,40,0.12)]"
            >
              Delete
            </button>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            {LEVELS.map((level) => {
              const isActive = activeLevel === level.value;
              const isSwitching = switchingLevel === level.value;

              return (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => onChangeLevel(level.value)}
                  disabled={isActive || Boolean(switchingLevel)}
                  className={`focus-ring rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.35em] transition-colors ${
                    isActive
                      ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-black"
                      : "border-subtle bg-[color:var(--surface)] text-primary hover:border-[color:var(--accent)]"
                  } ${isSwitching ? "opacity-70" : ""}`}
                >
                  {isSwitching ? "Switching..." : level.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">Curriculum</p>
            <h1 className="text-4xl font-display leading-none text-primary sm:text-5xl lg:text-6xl">{topic}</h1>
            {description && (
              <p className="text-sm text-muted max-w-2xl mt-2">{description}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            <span className="rounded-full border border-subtle bg-[color:var(--surface)] px-3 py-2 text-primary">{levelLabel}</span>
            <span className="rounded-full border border-subtle bg-[color:var(--surface)] px-3 py-2 text-primary">{daysLabel}</span>
            <span className="rounded-full border border-subtle bg-[color:var(--surface)] px-3 py-2 text-primary">{hoursLabel}</span>
          </div>
        </div>
        <div className="h-px w-full bg-line" />
      </div>
    </motion.header>
  );
}
