"use client";

import { Calendar, Clock, AlertCircle, Download, CheckCircle2, ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import WeekCard from "./WeekCard";
import { generateCurriculumPDF } from "@/utils/pdfGenerator";
import { useVideoCompletion } from "@/hooks/useVideoCompletion";
import { triggerConfetti } from "@/utils/confetti";

export default function CurriculumView({ curriculum, onBack, onChangeLevel, lastPayload }) {
  const data = curriculum || { topic: "", duration_days: 0, weeks: [], warning: null };
  const { completed, markComplete, isComplete } = useVideoCompletion(data.curriculum_id || "default");
  const [allComplete, setAllComplete] = useState(false);

  const getWeekKey = (week, index) => {
    const daySignature = (week.days || [])
      .map((day) => day.video?.youtube_id || day.video?.title || day.day || "")
      .join("|");

    return `week-${week.week ?? index}-${daySignature}`;
  };

  // Calculate total video duration in seconds
  const totalVideoSeconds = useMemo(() => {
    return (data.weeks || []).reduce((sum, week) => {
      return sum + (week.days || []).reduce((daySum, day) => {
        return daySum + (day.video?.duration_seconds || 0);
      }, 0);
    }, 0);
  }, [data.weeks]);

  // Calculate total videos
  const totalVideos = useMemo(() => {
    return (data.weeks || []).reduce((sum, week) => sum + (week.days?.length || 0), 0);
  }, [data.weeks]);

  const totalProjects = useMemo(() => {
    return (data.weeks || []).reduce((sum, week) => {
      return sum + (week.days || []).reduce((daySum, day) => {
        return daySum + (day.hands_on_project ? 1 : 0);
      }, 0);
    }, 0);
  }, [data.weeks]);

  // Calculate remaining time in hours
  const estimatedHoursRemaining = useMemo(() => {
    if (!data.hours_per_day || data.hours_per_day <= 0) return 0;
    
    const completedSeconds = Array.from(completed).reduce((sum, videoId) => {
      for (const week of (data.weeks || [])) {
        for (const day of (week.days || [])) {
          if (day.video?.youtube_id === videoId) {
            return sum + (day.video?.duration_seconds || 0);
          }
        }
      }
      return sum;
    }, 0);
    
    const remainingSeconds = totalVideoSeconds - completedSeconds;
    const remainingHours = remainingSeconds / 3600;
    return Math.max(0, Math.ceil(remainingHours * 10) / 10); // Round up to 1 decimal
  }, [completed, totalVideoSeconds, data.hours_per_day]);

  useEffect(() => {
    if (totalVideos > 0 && completed.size === totalVideos) {
      setAllComplete(true);
      triggerConfetti();
    } else {
      setAllComplete(false);
    }
  }, [completed, totalVideos]);

  // Reorganize weeks/days to put completed videos at the end
  const reorganizedData = useMemo(() => {
    if (!data.weeks) return data;

    const allDays = [];
    data.weeks.forEach((week) => {
      if (week.days) {
        week.days.forEach((day) => {
          allDays.push({ ...day, weekNumber: week.week, weekTheme: week.theme });
        });
      }
    });

    const incompleteDays = allDays.filter((day) => !isComplete(day.video.youtube_id));
    const completedDays = allDays.filter((day) => isComplete(day.video.youtube_id));

    // Reorganize into weeks
    const reorganizedWeeks = [];
    const daysToProcess = [...incompleteDays, ...completedDays];

    for (let i = 0; i < daysToProcess.length; i += 7) {
      const weekDays = daysToProcess.slice(i, i + 7);
      const weekNumber = Math.floor(i / 7) + 1;
      reorganizedWeeks.push({
        week: weekNumber,
        theme: weekDays[0]?.weekTheme || "Concepts",
        days: weekDays,
      });
    }

    return { ...data, weeks: reorganizedWeeks };
  }, [data, isComplete]);

  return (
    <section className="space-y-12">
      {/* Top nav: Back + Level toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onBack && onBack()}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <div className="flex items-center gap-2">
          {[{ key: "beginner", label: "Beginner" }, { key: "intermediate", label: "Intermediate" }, { key: "advanced", label: "Advanced" }].map((lvl) => {
            const active = (data.level || "").toLowerCase() === lvl.key;
            return (
              <button
                key={lvl.key}
                onClick={() => onChangeLevel && lastPayload && onChangeLevel(lvl.key)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${active ? "bg-amber-600 text-white" : "bg-white text-slate-700 border border-slate-100"}`}
              >
                {lvl.label}
              </button>
            );
          })}
        </div>
      </div>
      {/* Completion Banner */}
      {allComplete && (
        <div className="rounded-lg border-2 border-emerald-400 bg-emerald-50 p-6 flex items-center gap-4 animate-slideUp">
          <CheckCircle2 className="h-8 w-8 text-emerald-600 flex-shrink-0" strokeWidth={2} />
          <div>
            <h3 className="text-lg font-semibold text-emerald-900">Curriculum Complete! 🎉</h3>
            <p className="text-sm text-emerald-800">You've finished all videos in this learning path. Great job!</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="space-y-8 pb-8 border-b border-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="mb-4 font-display text-3xl font-bold text-slate-900 sm:text-5xl">{data.topic || "Your personalized curriculum"}</h2>
            <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              {data.description || "Follow this day-by-day path to master the subject. Start with fundamentals and progress to advanced concepts."}
            </p>
          </div>
          <button
            onClick={() => generateCurriculumPDF(data)}
            className="inline-flex w-full flex-shrink-0 items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-3 font-medium text-white transition-colors hover:bg-amber-700 sm:w-auto"
            title="Download curriculum as HTML"
          >
            <Download className="h-4 w-4" strokeWidth={2} />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-slate-300 bg-white p-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-2">Duration</p>
            <p className="text-2xl font-semibold text-slate-900">{data.duration_days ?? 0} days</p>
          </div>
          <div className="rounded-lg border border-slate-300 bg-white p-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-2">Time Remaining</p>
            <p className="text-2xl font-semibold text-slate-900">{estimatedHoursRemaining}h</p>
          </div>
          <div className="rounded-lg border border-slate-300 bg-white p-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-2">Videos</p>
            <p className="text-2xl font-semibold text-slate-900">{(data.weeks || []).reduce((sum, week) => sum + ((week.days && week.days.length) || 0), 0)}</p>
          </div>
          <div className="rounded-lg border border-slate-300 bg-white p-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-2">Projects</p>
            <p className="text-2xl font-semibold text-slate-900">{totalProjects}</p>
          </div>
        </div>

        {/* Time Estimate Breakdown */}
        {data.estimated_total_hours !== undefined && data.estimated_total_hours !== null && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" strokeWidth={2} />
              Time Estimate Breakdown
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-lg bg-white p-4 border border-blue-100">
                <p className="text-xs text-slate-600 mb-1">Video content</p>
                <p className="text-xl font-semibold text-slate-900">{(data.estimated_video_hours || 0).toFixed(2)}h</p>
              </div>
              {data.estimated_reading_hours > 0 && (
                <div className="rounded-lg bg-white p-4 border border-blue-100">
                  <p className="text-xs text-slate-600 mb-1">Reading (papers/docs)</p>
                  <p className="text-xl font-semibold text-slate-900">{(data.estimated_reading_hours || 0).toFixed(2)}h</p>
                </div>
              )}
              <div className="rounded-lg bg-white p-4 border border-blue-100">
                <p className="text-xs text-slate-600 mb-1">Practice & hands-on</p>
                <p className="text-xl font-semibold text-slate-900">{(data.estimated_practice_hours || 0).toFixed(2)}h</p>
              </div>
              <div className="rounded-lg bg-white p-4 border border-blue-100">
                <p className="text-xs text-slate-600 mb-1">Review & retention</p>
                <p className="text-xl font-semibold text-slate-900">{(data.estimated_review_hours || 0).toFixed(2)}h</p>
              </div>
              <div className="rounded-lg bg-white p-4 border border-blue-100">
                <p className="text-xs text-slate-600 mb-1">Buffer (contingency)</p>
                <p className="text-xl font-semibold text-slate-900">{(data.estimated_buffer_hours || 0).toFixed(2)}h</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-blue-900">Total estimated time</span>
                <span className="text-2xl font-bold text-blue-900">{(data.estimated_total_hours || 0).toFixed(2)}h</span>
              </div>
              {data.hours_per_day && data.hours_per_day > 0 && (
                <p className="text-xs text-blue-700 mt-3">
                  At your pace of {data.hours_per_day}h/day: <strong>~{data.duration_days ?? 0} days</strong>
                </p>
              )}
            </div>
          </div>
        )}

        {data.warning && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
            <p className="text-sm text-amber-800">{data.warning}</p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">Progress</p>
            <p className="text-sm text-slate-600">{completed.size} / {totalVideos} videos completed</p>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-600 transition-all duration-300"
              style={{ width: `${totalVideos > 0 ? (completed.size / totalVideos) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Weeks */}
      <motion.div layout className="space-y-6">
        <AnimatePresence mode="popLayout">
          {(reorganizedData.weeks || []).map((week, index) => (
            <motion.div
              key={getWeekKey(week, index)}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              style={{ willChange: "transform, opacity" }}
            >
              <WeekCard week={week} isComplete={isComplete} markComplete={markComplete} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
