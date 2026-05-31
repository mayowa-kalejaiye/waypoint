"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";

export default function GoalInput({ onSubmit, loading }) {
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("beginner");
  const [hoursPerDay, setHoursPerDay] = useState(1);
  const [isLevelOpen, setIsLevelOpen] = useState(false);
  const levelRef = useRef(null);

  const levels = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (levelRef.current && !levelRef.current.contains(e.target)) {
        setIsLevelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submit = (event) => {
    event.preventDefault();
    if (goal.trim()) {
      onSubmit({
        goal,
        level,
        hours_per_day: Number(hoursPerDay),
      });
    }
  };

  const handleQuickSelect = (template) => {
    setGoal(template);
  };

  return (
    <form onSubmit={submit} className="space-y-8 w-full max-w-xl">
      {/* Goal Input */}
      <div className="space-y-3">
        <label htmlFor="goal" className="block text-sm font-medium text-slate-900">
          What would you like to learn?
        </label>
        <textarea
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="E.g., Master TypeScript for React development"
          className="w-full p-4 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none resize-none text-base leading-relaxed rounded-lg border border-slate-300 hover:border-slate-400 focus:border-amber-500 transition-colors"
          rows={2}
          required
          disabled={loading}
        />

        {/* Quick Templates */}
        <div className="space-y-2 pt-3">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">Quick start:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              "Build a portfolio website with React",
              "Learn data structures in Python",
              "Plan a content strategy for a product launch",
            ].map((template) => (
              <button
                key={template}
                type="button"
                onClick={() => handleQuickSelect(template)}
                disabled={loading}
                className="text-left text-xs px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-slate-700 hover:border-amber-400 hover:bg-amber-100 transition-colors disabled:opacity-50"
              >
                {template}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Level and Hours Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Level Selector */}
        <div className="space-y-2 relative" ref={levelRef}>
          <label className="block text-sm font-medium text-slate-900">Experience</label>
          <button
            type="button"
            onClick={() => setIsLevelOpen(!isLevelOpen)}
            disabled={loading}
            className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 hover:border-slate-400 transition-colors disabled:opacity-50 flex items-center justify-between"
          >
            <span>{levels.find(l => l.value === level)?.label}</span>
            <svg className={`w-4 h-4 transition-transform duration-300 ${isLevelOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
          
          {isLevelOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-lg border border-slate-200 shadow-lg z-20 overflow-hidden">
              {levels.map((lvl) => (
                <button
                  key={lvl.value}
                  type="button"
                  onClick={() => {
                    setLevel(lvl.value);
                    setIsLevelOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-amber-50 transition-colors border-b border-slate-200 last:border-0 text-sm text-slate-900"
                >
                  {lvl.label}
                  {level === lvl.value && (
                    <span className="ml-2 text-amber-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hours Selector */}
        <div className="space-y-2">
          <label htmlFor="hours" className="block text-sm font-medium text-slate-900">
            Hours per day
          </label>
          <div className="flex items-center gap-3">
            <input
              id="hours"
              type="range"
              min="0.5"
              max="4"
              step="0.5"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
              className="flex-1 h-2 bg-slate-300 rounded-full appearance-none cursor-pointer accent-amber-600"
              disabled={loading}
            />
            <span className="text-sm text-slate-600 w-12 text-right">{hoursPerDay}h</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !goal.trim()}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
          goal.trim() && !loading
            ? "bg-amber-600 text-white hover:bg-amber-700"
            : "bg-slate-200 text-slate-500 cursor-not-allowed"
        }`}
      >
        <Send className="h-4 w-4" strokeWidth={2} />
        {loading ? "Building..." : "Generate Curriculum"}
      </button>
    </form>
  );
}
