"use client";

import { useState } from "react";
import { ChevronDown, BookOpen, Flame } from "lucide-react";
import DayCard from "./DayCard";

export default function WeekCard({ week, isComplete, markComplete }) {
  const [open, setOpen] = useState(true);

  const dayCount = week.days.length;
  const totalMinutes = week.days.reduce((sum, day) => sum + Math.round(day.video.duration_seconds / 60), 0);
  const avgScore = (week.days.reduce((sum, day) => sum + Number(day.video.score), 0) / dayCount * 100).toFixed(0);

  return (
    <section className="rounded-lg border border-slate-300 bg-slate-50 overflow-hidden">
      {/* Week Header */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full px-6 py-5 text-left hover:bg-amber-50 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold">
                {String(week.week).padStart(2, "0")}
              </span>
              <span className="text-xs text-slate-600">{dayCount} days • {totalMinutes} min • {avgScore}%</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{week.theme}</h3>
          </div>
          <div className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
            <ChevronDown className="h-5 w-5 text-slate-600" strokeWidth={2} />
          </div>
        </div>
      </button>

      {/* Days List */}
      {open && (
        <div className="border-t border-slate-300 divide-y divide-slate-300">
          {week.days.length > 0 ? (
            week.days.map((day, index) => (
              <div
                key={`week-${week.week}-day-${day.day}`}
                className="animate-slideUp"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <DayCard day={day} isComplete={isComplete} markComplete={markComplete} />
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-slate-600 text-sm">
              No days in this week
            </div>
          )}
        </div>
      )}
    </section>
  );
}
