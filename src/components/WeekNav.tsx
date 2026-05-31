"use client";

import { motion } from "framer-motion";
import type { Week } from "@/types/curriculum";

interface WeekNavProps {
  weeks: Week[];
  activeWeek: number;
  onSelectWeek: (week: number) => void;
}

export default function WeekNav({ weeks, activeWeek, onSelectWeek }: WeekNavProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="sticky top-[95px] z-30 border-b border-subtle bg-[color:rgba(10,10,10,0.78)] backdrop-blur-xl"
    >
      <div className="mx-auto flex w-full max-w-[1600px] gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8 scrollbar-hide">
        {weeks.map((week) => {
          const active = week.week === activeWeek;

          return (
            <motion.button
              key={week.week}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectWeek(week.week)}
              className={`focus-ring shrink-0 rounded-full border px-4 py-2 text-left font-mono text-[11px] uppercase tracking-[0.32em] transition-colors ${active ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-black" : "border-subtle bg-[color:var(--surface)] text-primary"}`}
            >
              <span className="block">Week {week.week}</span>
              <span className="mt-1 block truncate text-[10px] text-inherit opacity-80">{week.theme}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
