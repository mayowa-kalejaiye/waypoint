"use client";

import { motion } from "framer-motion";
import type { Day, ProjectDayPlan, Week, Video } from "@/types/curriculum";
import DayCard from "./DayCard";

interface WeekSectionProps {
  curriculumId: string;
  week: Week;
  sectionRef: (element: HTMLElement | null) => void;
  completionState: Record<string, boolean>;
  onToggleComplete: (key: string) => void;
  onPlayVideo?: (video: Video, dayKey: string) => void;
  projectPlanByKey?: Record<string, ProjectDayPlan | undefined>;
}

function makeDayKey(weekNumber: number, day: Day) {
  const videoId = day.video.youtube_id || day.video.doc_id || day.video.repo_id || day.video.paper_id || day.day;
  return `${weekNumber}-${day.day}-${videoId}`;
}

export function weekDayKey(weekNumber: number, day: Day) {
  return makeDayKey(weekNumber, day);
}

export default function WeekSection({ curriculumId, week, sectionRef, completionState, onToggleComplete, onPlayVideo, projectPlanByKey }: WeekSectionProps) {
  return (
    <motion.section
      id={`week-${week.week}`}
      ref={sectionRef as never}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="scroll-mt-40 space-y-6"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="font-display text-5xl leading-none text-primary sm:text-6xl">{String(week.week).padStart(2, "0")}</p>
          <h2 className="max-w-3xl text-2xl font-display text-primary sm:text-3xl">{week.theme}</h2>
        </div>
        <p className="max-w-xl font-mono text-[10px] uppercase tracking-[0.32em] text-muted">
          {week.days.length} days. Structured from concepts to applied practice.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {week.days.map((day) => {
          const key = makeDayKey(week.week, day);

          return (
            <DayCard
              key={key}
              curriculumId={curriculumId}
              day={day}
              projectPlan={projectPlanByKey?.[key]}
              weekNumber={week.week}
              completed={Boolean(completionState[key])}
              onToggleComplete={() => onToggleComplete(key)}
              onPlayVideo={onPlayVideo && (day.video.source_type || "youtube") === "youtube" ? () => onPlayVideo(day.video, key) : undefined}
              onPlayAlternative={onPlayVideo && day.alternative_video && (day.alternative_video.source_type || "youtube") === "youtube" ? () => onPlayVideo(day.alternative_video!, key) : undefined}
            />
          );
        })}
      </div>
    </motion.section>
  );
}
