"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Clock3,
  LayoutGrid,
  List,
  Maximize2,
  Redo2,
  Share2,
  Undo2,
  ZoomIn,
  ZoomOut,
  Music,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import VideoPlayer from "./VideoPlayer";

const CANVAS_CARD_WIDTH = 220;
const CANVAS_CARD_HEIGHT = 160;
const CANVAS_COLUMN_GAP = 280;
const CANVAS_ROW_GAP = 140;
const CANVAS_WORLD_WIDTH = 1540;
const CANVAS_WORLD_HEIGHT = 1120;
const CANVAS_MIN_SCALE = 0.48;
const CANVAS_MAX_SCALE = 1.9;
const SIDEBAR_WIDTH = "clamp(360px, 28vw, 460px)";

const DEFAULT_CURRICULUM_TITLE = "Machine Learning";

const DEFAULT_NODES = [
  {
    id: "ml-1",
    week: 1,
    day: 1,
    concept: "Foundations",
    title: "What machine learning actually is",
    channel: "StatQuest",
    duration_seconds: 760,
    score: 96,
    youtube_id: "GwIo3gDZCVQ",
    thumbnail_url: "https://img.youtube.com/vi/GwIo3gDZCVQ/hqdefault.jpg",
    completed: true,
  },
  {
    id: "ml-2",
    week: 1,
    day: 2,
    concept: "Linear Models",
    title: "Linear regression without the fluff",
    channel: "StatQuest",
    duration_seconds: 920,
    score: 91,
    youtube_id: "J_LnPL3Qg70",
    thumbnail_url: "https://img.youtube.com/vi/J_LnPL3Qg70/hqdefault.jpg",
    completed: true,
  },
  {
    id: "ml-3",
    week: 1,
    day: 3,
    concept: "Classification",
    title: "Decision boundaries and logistic intuition",
    channel: "3Blue1Brown",
    duration_seconds: 860,
    score: 88,
    youtube_id: "aircAruvnKk",
    thumbnail_url: "https://img.youtube.com/vi/aircAruvnKk/hqdefault.jpg",
    completed: false,
  },
  {
    id: "ml-4",
    week: 1,
    day: 4,
    concept: "Evaluation",
    title: "How to measure real model quality",
    channel: "Google Cloud Tech",
    duration_seconds: 980,
    score: 90,
    youtube_id: "fSytzGwwBVw",
    thumbnail_url: "https://img.youtube.com/vi/fSytzGwwBVw/hqdefault.jpg",
    completed: false,
  },
  {
    id: "ml-5",
    week: 2,
    day: 5,
    concept: "Feature Engineering",
    title: "Feature prep that actually changes outcomes",
    channel: "AssemblyAI",
    duration_seconds: 1040,
    score: 87,
    youtube_id: "7R8Scm5jlhg",
    thumbnail_url: "https://img.youtube.com/vi/7R8Scm5jlhg/hqdefault.jpg",
    completed: false,
  },
  {
    id: "ml-6",
    week: 2,
    day: 6,
    concept: "Tree Models",
    title: "Trees, random forests, and boosted ensembles",
    channel: "StatQuest",
    duration_seconds: 1120,
    score: 94,
    youtube_id: "J4Wdy0Wc_xQ",
    thumbnail_url: "https://img.youtube.com/vi/J4Wdy0Wc_xQ/hqdefault.jpg",
    completed: false,
  },
  {
    id: "ml-7",
    week: 2,
    day: 7,
    concept: "Neural Nets",
    title: "Neural networks and representation learning",
    channel: "3Blue1Brown",
    duration_seconds: 1180,
    score: 92,
    youtube_id: "IHZwWFHWa-w",
    thumbnail_url: "https://img.youtube.com/vi/IHZwWFHWa-w/hqdefault.jpg",
    completed: false,
  },
  {
    id: "ml-8",
    week: 2,
    day: 8,
    concept: "Deployment",
    title: "Shipping, monitoring, and iterating models",
    channel: "Full Stack Deep Learning",
    duration_seconds: 1010,
    score: 89,
    youtube_id: "xC-c7E5PK0Y",
    thumbnail_url: "https://img.youtube.com/vi/xC-c7E5PK0Y/hqdefault.jpg",
    completed: false,
  },
];

const DEFAULT_LINKS = [
  { id: "link-1", from: "ml-1", to: "ml-2" },
  { id: "link-2", from: "ml-1", to: "ml-3" },
  { id: "link-3", from: "ml-2", to: "ml-4" },
  { id: "link-4", from: "ml-3", to: "ml-4" },
  { id: "link-5", from: "ml-4", to: "ml-5" },
  { id: "link-6", from: "ml-5", to: "ml-6" },
  { id: "link-7", from: "ml-6", to: "ml-7" },
  { id: "link-8", from: "ml-6", to: "ml-8" },
];

const CONCEPT_COLORS = {
  Foundations: "rgba(160, 176, 199, 0.72)",
  Linear: "rgba(126, 139, 255, 0.72)",
  Classification: "rgba(118, 220, 200, 0.72)",
  Evaluation: "rgba(245, 183, 77, 0.72)",
  Feature: "rgba(255, 170, 110, 0.72)",
  Tree: "rgba(228, 112, 146, 0.72)",
  Neural: "rgba(192, 147, 255, 0.72)",
  Deployment: "rgba(120, 214, 176, 0.72)",
  default: "rgba(175, 175, 175, 0.72)",
};

function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return "—";
  const minutes = Math.max(1, Math.round(seconds / 60));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

function formatDayLabel(dayNumber) {
  return `Day ${String(dayNumber).padStart(2, "0")}`;
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function getThumbnail(node) {
  if (node.thumbnail_url) return node.thumbnail_url;
  if (node.youtube_id) return `https://img.youtube.com/vi/${node.youtube_id}/hqdefault.jpg`;
  return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80";
}

function normalizeNodes(inputNodes) {
  const sourceNodes = Array.isArray(inputNodes) && inputNodes.length ? inputNodes : DEFAULT_NODES;

  return sourceNodes.slice(0, 8).map((node, index) => {
    const fallbackNode = DEFAULT_NODES[index] || DEFAULT_NODES[DEFAULT_NODES.length - 1];
    const durationSeconds = typeof node.duration_seconds === "number" ? node.duration_seconds : fallbackNode.duration_seconds;

    return {
      ...fallbackNode,
      ...node,
      id: node.id || fallbackNode.id,
      title: node.title || fallbackNode.title,
      channel: node.channel || fallbackNode.channel,
      duration_seconds: durationSeconds,
      score: typeof node.score === "number" ? node.score : fallbackNode.score,
      youtube_id: node.youtube_id || fallbackNode.youtube_id,
      thumbnail_url:
        node.thumbnail_url ||
        (node.youtube_id || fallbackNode.youtube_id ? `https://img.youtube.com/vi/${node.youtube_id || fallbackNode.youtube_id}/hqdefault.jpg` : fallbackNode.thumbnail_url),
      week: fallbackNode.week,
      day: fallbackNode.day,
      concept: fallbackNode.concept,
      completed: typeof node.completed === "boolean" ? node.completed : fallbackNode.completed,
    };
  });
}

function buildInitialPositions(nodes) {
  const slotPattern = [1, 2, 3, 2];
  const layoutNodes = [];
  let cursor = 0;

  slotPattern.forEach((slotCount, columnIndex) => {
    const columnNodes = nodes.slice(cursor, cursor + slotCount);
    cursor += slotCount;
    if (columnNodes.length === 0) return;

    const columnHeight = (columnNodes.length - 1) * CANVAS_ROW_GAP;
    const startTop = CANVAS_WORLD_HEIGHT / 2 - columnHeight / 2;
    const left = 140 + columnIndex * CANVAS_COLUMN_GAP;

    columnNodes.forEach((node, rowIndex) => {
      layoutNodes.push({
        id: node.id,
        left,
        top: startTop + rowIndex * CANVAS_ROW_GAP,
      });
    });
  });

  if (cursor < nodes.length) {
    const overflowNodes = nodes.slice(cursor);
    overflowNodes.forEach((node, overflowIndex) => {
      layoutNodes.push({
        id: node.id,
        left: 140 + 3 * CANVAS_COLUMN_GAP,
        top: CANVAS_WORLD_HEIGHT / 2 + 220 + overflowIndex * CANVAS_ROW_GAP,
      });
    });
  }

  return layoutNodes.reduce((accumulator, entry) => {
    accumulator[entry.id] = { left: entry.left, top: entry.top };
    return accumulator;
  }, {});
}

function buildCurvedPath(sourcePosition, targetPosition) {
  const sourceRight = sourcePosition.left + CANVAS_CARD_WIDTH;
  const sourceCenterY = sourcePosition.top + CANVAS_CARD_HEIGHT / 2;
  const targetLeft = targetPosition.left;
  const targetCenterY = targetPosition.top + CANVAS_CARD_HEIGHT / 2;
  const controlDistance = clamp(Math.abs(targetLeft - sourceRight) * 0.46, 120, 260);
  const bend = targetCenterY >= sourceCenterY ? 48 : -48;
  const controlPoint1X = sourceRight + controlDistance;
  const controlPoint2X = targetLeft - controlDistance;

  return `M ${sourceRight} ${sourceCenterY} C ${controlPoint1X} ${sourceCenterY + bend}, ${controlPoint2X} ${targetCenterY - bend}, ${targetLeft} ${targetCenterY}`;
}

function calculateBounds(positions) {
  const positionEntries = Object.values(positions);
  if (!positionEntries.length) {
    return { left: 0, top: 0, width: CANVAS_WORLD_WIDTH, height: CANVAS_WORLD_HEIGHT };
  }

  let minLeft = Number.POSITIVE_INFINITY;
  let minTop = Number.POSITIVE_INFINITY;
  let maxRight = Number.NEGATIVE_INFINITY;
  let maxBottom = Number.NEGATIVE_INFINITY;

  positionEntries.forEach((position) => {
    minLeft = Math.min(minLeft, position.left);
    minTop = Math.min(minTop, position.top);
    maxRight = Math.max(maxRight, position.left + CANVAS_CARD_WIDTH);
    maxBottom = Math.max(maxBottom, position.top + CANVAS_CARD_HEIGHT);
  });

  return {
    left: minLeft,
    top: minTop,
    width: maxRight - minLeft,
    height: maxBottom - minTop,
  };
}

function calculateStreak(nodes, completedIds) {
  let streak = 0;
  for (const node of nodes) {
    if (!completedIds.has(node.id)) break;
    streak += 1;
  }
  return streak;
}

function useCountUpValue(targetValue, duration = 900, delay = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frameId = 0;
    let cancelled = false;

    const startTime = performance.now() + delay;

    const tick = (time) => {
      if (cancelled) return;

      const elapsed = time - startTime;
      if (elapsed < 0) {
        frameId = window.requestAnimationFrame(tick);
        return;
      }

      const progress = clamp(elapsed / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(targetValue * eased);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    setValue(0);
    frameId = window.requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
    };
  }, [delay, duration, targetValue]);

  return value;
}

function useElementSize(elementRef) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = elementRef.current;
    if (!element || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const nextWidth = Math.round(entry.contentRect.width);
      const nextHeight = Math.round(entry.contentRect.height);
      setSize({ width: nextWidth, height: nextHeight });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef]);

  return size;
}

function useCompactViewport() {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsCompact(mediaQuery.matches);

    update();
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", update);
      return () => mediaQuery.removeEventListener("change", update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  return isCompact;
}

function SectionLabel({ children }) {
  return <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[color:var(--text-secondary)]">{children}</p>;
}

function SectionDivider() {
  return <div className="h-px w-full bg-[color:var(--border)]" />;
}

function StatTile({ label, value, tone = "default", suffix }) {
  const valueClassName = tone === "accent" ? "text-[color:var(--accent)]" : tone === "success" ? "text-[color:var(--success)]" : "text-primary";

  return (
    <div className="rounded-[18px] border border-[color:var(--border)] bg-[color:var(--bg-card)] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-display text-[1.35rem] leading-none text-primary">{value}</p>
          {suffix ? <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">{suffix}</p> : null}
        </div>
        <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${valueClassName}`}>{label}</p>
      </div>
    </div>
  );
}

function MiniMap({ nodes, positions, viewportSize, pan, scale, onNavigate }) {
  const miniMapWidth = 160;
  const miniMapHeight = 100;
  const miniMapScale = Math.min(miniMapWidth / CANVAS_WORLD_WIDTH, miniMapHeight / CANVAS_WORLD_HEIGHT);
  const viewportLeft = clamp((-pan.left / scale) * miniMapScale, 0, miniMapWidth);
  const viewportTop = clamp((-pan.top / scale) * miniMapScale, 0, miniMapHeight);
  const viewportWidth = clamp((viewportSize.width / scale) * miniMapScale, 0, miniMapWidth);
  const viewportHeight = clamp((viewportSize.height / scale) * miniMapScale, 0, miniMapHeight);

  return (
    <button
      type="button"
      onClick={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const relativeX = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
        const relativeY = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
        onNavigate({ relativeX, relativeY });
      }}
      className="group absolute bottom-4 left-4 z-30 overflow-hidden rounded-[10px] border border-[color:var(--border)] bg-[color:var(--bg-card)] shadow-[0_14px_40px_rgba(0,0,0,0.45)] transition-transform duration-200 hover:scale-[1.01]"
      aria-label="Mini map"
    >
      <div className="flex items-center justify-between border-b border-[color:var(--border)] px-3 py-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Map</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[color:var(--text-muted)]">Tap to center</span>
      </div>

      <div
        className="relative"
        style={{ width: miniMapWidth, height: miniMapHeight, background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.015))" }}
      >
        {nodes.map((node) => {
          const position = positions[node.id];
          if (!position) return null;

          return (
            <span
              key={node.id}
              className="absolute rounded-full"
              style={{
                left: position.left * miniMapScale,
                top: position.top * miniMapScale,
                width: 4,
                height: 4,
                background: node.completed ? "var(--accent)" : "rgba(255,255,255,0.25)",
                boxShadow: node.completed ? "0 0 10px rgba(200, 254, 2, 0.35)" : "none",
              }}
            />
          );
        })}

        <div
          className="pointer-events-none absolute rounded-[4px] border border-[color:rgba(200,254,2,0.65)] bg-[color:rgba(200,254,2,0.08)]"
          style={{ left: viewportLeft, top: viewportTop, width: viewportWidth, height: viewportHeight }}
        />
      </div>
    </button>
  );
}

function resolveConceptTone(concept) {
  const key = Object.keys(CONCEPT_COLORS).find((entry) => concept.toLowerCase().includes(entry.toLowerCase()));
  return CONCEPT_COLORS[key || "default"];
}

function CheckMark({ isCompleted }) {
  return isCompleted ? <span className="text-[color:var(--success)]">✓</span> : <span className="text-[color:var(--text-muted)]">◯</span>;
}

function IconButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-7 w-7 items-center justify-center rounded-[4px] text-[color:var(--text-secondary)] transition-colors hover:bg-[color:var(--bg-secondary)] hover:text-primary"
    >
      <Icon size={14} />
    </button>
  );
}

function SidebarContent({
  title,
  nodes,
  completedIds,
  selectedNode,
  completionPercent,
  completedCount,
  streakCount,
  hoursWatched,
  weeklyGroups,
  expandedWeeks,
  setExpandedWeeks,
  onWatch,
  onMarkComplete,
  onReset,
}) {
  const selectedIndex = selectedNode ? nodes.findIndex((node) => node.id === selectedNode.id) : -1;
  const nextNode = selectedNode || nodes.find((node) => !completedIds.has(node.id)) || nodes[0] || null;
  const progressCircleRadius = 52;
  const progressCircleCircumference = 2 * Math.PI * progressCircleRadius;
  const progressStrokeOffset = progressCircleCircumference - (completionPercent / 100) * progressCircleCircumference;
  const selectedCompleted = selectedNode ? completedIds.has(selectedNode.id) : false;

  return (
    <div className="flex min-h-full flex-col gap-5">
      <div className="space-y-2">
        <SectionLabel>Curriculum info</SectionLabel>
        <h1 className="font-display text-[20px] leading-tight text-primary">{title}</h1>
        <p className="font-mono text-[12px] text-[color:var(--text-secondary)]">Beginner · 8 days · 1.5h/day</p>
      </div>

      <SectionDivider />

      <div className="flex flex-col items-center gap-4 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--bg-card)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="relative h-[132px] w-[132px]">
          <svg viewBox="0 0 132 132" className="h-full w-full -rotate-90">
            <circle cx="66" cy="66" r={progressCircleRadius} stroke="rgba(255,255,255,0.08)" strokeWidth="4" fill="none" />
            <motion.circle
              cx="66"
              cy="66"
              r={progressCircleRadius}
              stroke="rgb(200, 254, 2)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={progressCircleCircumference}
              strokeDashoffset={progressStrokeOffset}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: completionPercent / 100 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ filter: "drop-shadow(0 0 12px rgba(200,254,2,0.3))" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="font-display text-[2rem] leading-none text-primary">{Math.round(completionPercent)}%</p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">complete</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatTile label="Days completed" value={String(Math.round(completedCount))} tone="accent" suffix="days" />
        <div className="rounded-[18px] border border-[color:var(--border)] bg-[color:var(--bg-card)] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex items-end justify-between gap-3">
            <div>
              <motion.p
                className="font-display text-[1.35rem] leading-none text-primary"
                animate={streakCount > 0 ? { rotate: [0, -6, 0, 6, 0] } : { rotate: 0 }}
                transition={streakCount > 0 ? { duration: 0.85, repeat: Infinity, repeatDelay: 1.2 } : { duration: 0.2 }}
              >
                {Math.round(streakCount)} 🔥
              </motion.p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">streak</p>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--success)]">current</p>
          </div>
        </div>
        <StatTile label="Videos watched" value={String(Math.round(completedCount))} suffix="watched" />
        <StatTile label="Time invested" value={`${hoursWatched.toFixed(1)}h`} tone="success" suffix="deep work" />
      </div>

      <SectionDivider />

      <div className="space-y-3 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--bg-card)] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <SectionLabel>Up next</SectionLabel>
        {nextNode ? (
          <div className="overflow-hidden rounded-[16px] border border-[color:var(--border)] bg-[color:var(--bg-secondary)]">
            <img src={getThumbnail(nextNode)} alt={nextNode.title} className="h-14 w-full object-cover" loading="lazy" />
            <div className="space-y-2 p-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-[color:var(--accent)]">{nextNode.concept}</p>
              <p className="line-clamp-2 text-[13px] font-semibold leading-5 text-primary">{nextNode.title}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-secondary)]">
                {nextNode.channel} · {formatDuration(nextNode.duration_seconds)}
              </p>
              <button
                type="button"
                onClick={() => onWatch(nextNode)}
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--accent)] transition-colors hover:text-primary"
              >
                Watch now <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <SectionDivider />

      <div className="space-y-3">
        <SectionLabel>Path breakdown</SectionLabel>
        {weeklyGroups.map((weekGroup) => {
          const isExpanded = expandedWeeks.includes(weekGroup.week);
          const weekCompleted = weekGroup.nodes.filter((node) => completedIds.has(node.id)).length;
          const weekProgress = weekGroup.nodes.length ? Math.round((weekCompleted / weekGroup.nodes.length) * 100) : 0;

          return (
            <div key={weekGroup.week} className="rounded-[18px] border border-[color:var(--border)] bg-[color:var(--bg-card)] p-4">
              <button
                type="button"
                onClick={() => {
                  setExpandedWeeks((currentWeeks) =>
                    currentWeeks.includes(weekGroup.week) ? currentWeeks.filter((weekNumber) => weekNumber !== weekGroup.week) : [...currentWeeks, weekGroup.week],
                  );
                }}
                className="flex w-full items-center justify-between gap-3 text-left"
              >
                <div>
                  <p className="font-display text-[18px] leading-none text-primary">Week {String(weekGroup.week).padStart(2, "0")}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">{weekGroup.theme}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-[color:var(--text-secondary)]">{weekCompleted}/{weekGroup.nodes.length}</p>
                  <div className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-[color:var(--bg-secondary)]">
                    <div className="h-full rounded-full bg-[color:var(--accent)]" style={{ width: `${weekProgress}%` }} />
                  </div>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded ? (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mt-3 space-y-2">
                    {weekGroup.nodes.map((node) => {
                      const isCompleted = completedIds.has(node.id);
                      const isSelected = selectedNode && selectedNode.id === node.id;

                      return (
                        <div
                          key={node.id}
                          className={`rounded-[14px] border px-3 py-3 transition-colors ${
                            isSelected ? "border-[color:var(--accent)] bg-[color:rgba(200,254,2,0.05)]" : "border-[color:var(--border)] bg-[color:var(--bg-secondary)]"
                          } ${isCompleted ? "opacity-85" : "opacity-100"}`}
                        >
                          <div className="flex items-start gap-3">
                            <button type="button" onClick={() => onWatch(node)} className="group relative h-14 w-[92px] overflow-hidden rounded-[8px] border border-[color:var(--border)]">
                              <img src={getThumbnail(node)} alt={node.title} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" loading="lazy" />
                              <span className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                            </button>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-[color:var(--accent)]">{node.concept}</p>
                                  <button type="button" onClick={() => onWatch(node)} className="mt-1 text-left text-[14px] font-semibold leading-5 text-primary">
                                    {node.title}
                                  </button>
                                </div>
                                <span className="font-mono text-[10px] text-[color:var(--text-secondary)]">{node.score}%</span>
                              </div>
                              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
                                {node.channel} · {formatDuration(node.duration_seconds)}
                              </p>
                              <div className="mt-2 flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => onWatch(node)}
                                  className="inline-flex h-7 items-center rounded-[4px] bg-[color:var(--accent)] px-3 font-mono text-[10px] font-semibold text-black"
                                >
                                  Watch
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onMarkComplete(node)}
                                  className={`inline-flex h-7 items-center rounded-[4px] border px-3 font-mono text-[10px] ${
                                    isCompleted
                                      ? "border-[color:var(--success)] text-[color:var(--success)]"
                                      : "border-[color:var(--border)] text-[color:var(--text-secondary)]"
                                  }`}
                                >
                                  {isCompleted ? "Done" : "Mark complete"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <SectionDivider />

      <div className="space-y-3">
        <button
          type="button"
          onClick={onMarkComplete}
          className="inline-flex h-10 w-full items-center justify-center rounded-[4px] bg-[color:var(--accent)] font-mono text-[12px] font-semibold text-black transition-all hover:brightness-110"
        >
          Mark current complete
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-8 w-full items-center justify-center rounded-[4px] border border-[color:var(--border)] bg-transparent font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--text-secondary)]"
        >
          Reset progress
        </button>
      </div>

      <div className="rounded-[16px] border border-[color:var(--border)] bg-[color:var(--bg-card)] p-3 text-[10px] uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">
        <p>Selected lesson</p>
        <p className="mt-2 truncate text-[12px] tracking-normal text-primary">{selectedNode?.title || "No lesson selected"}</p>
        <p className="mt-1 truncate tracking-normal text-[color:var(--text-muted)]">
          {selectedNode ? `${selectedNode.channel} · ${formatDuration(selectedNode.duration_seconds)}` : "Choose a card to focus the sidebar."}
        </p>
        <p className="mt-3 tracking-normal text-[color:var(--text-muted)]">State: {selectedCompleted ? "done" : selectedIndex >= 0 ? "in progress" : "up next"}</p>
      </div>
    </div>
  );
}

export default function CanvasResultPage({ nodes: incomingNodes, links: incomingLinks, storageKey = "canvas", ready = true, title = DEFAULT_CURRICULUM_TITLE, embedded = false, curriculumId = null }) {
  const isCompactViewport = useCompactViewport();
  const viewportRef = useRef(null);
  const worldRef = useRef(null);
  const cardRefs = useRef(new Map());
  const moveStateRef = useRef(null);
  const panStateRef = useRef(null);
  const historyRef = useRef({ undo: [], redo: [] });
  const positionsRef = useRef({});
  const scaleRef = useRef(1);
  const panRef = useRef({ left: 0, top: 0 });
  const didFitRef = useRef(false);

  const normalizedNodes = useMemo(() => normalizeNodes(incomingNodes), [incomingNodes]);
  const normalizedLinks = useMemo(() => (Array.isArray(incomingLinks) && incomingLinks.length ? incomingLinks : DEFAULT_LINKS), [incomingLinks]);
  const initialPositions = useMemo(() => buildInitialPositions(normalizedNodes), [normalizedNodes]);
  const viewportSize = useElementSize(viewportRef);

  const [activeView, setActiveView] = useState(isCompactViewport ? "list" : "canvas");
  const [positions, setPositions] = useState(() => initialPositions);
  const [completedIds, setCompletedIds] = useState(() => new Set(normalizedNodes.filter((node) => node.completed).map((node) => node.id)));
  const [selectedNodeId, setSelectedNodeId] = useState(normalizedNodes[0]?.id || null);
  const [watchingNodeId, setWatchingNodeId] = useState(null);
  const [expandedWeeks, setExpandedWeeks] = useState([1, 2]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarPulseToken, setSidebarPulseToken] = useState(0);
  const [timelineTooltip, setTimelineTooltip] = useState(null);
  const [showLines, setShowLines] = useState(false);
  const [pan, setPan] = useState({ left: 0, top: 0 });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isCompactViewport && activeView === "canvas") {
      setActiveView("list");
    }
  }, [activeView, isCompactViewport]);

  useEffect(() => {
    const shouldUseStorage = typeof storageKey === "string" && storageKey.includes(":");

    didFitRef.current = false;
    historyRef.current = { undo: [], redo: [] };
    setPan({ left: 0, top: 0 });
    setScale(1);

    if (!shouldUseStorage) {
      // Avoid loading persisted state for generic canvases (no namespace).
      setPositions(initialPositions);
      setCompletedIds(new Set(normalizedNodes.filter((node) => node.completed).map((node) => node.id)));
      setSelectedNodeId(normalizedNodes.find((node) => !node.completed)?.id || normalizedNodes[0]?.id || null);
      return;
    }

    const hasAllCanvasNodes = (candidatePositions) =>
      normalizedNodes.length > 0 && normalizedNodes.every((node) => candidatePositions && candidatePositions[node.id]);

    const storedPositionsKey = `waypoint:canvas-positions:${storageKey}`;
    const storedCompletedKey = `waypoint:canvas-completed:${storageKey}`;
    const storedViewKey = `waypoint:canvas-view:${storageKey}`;
    const storedSelectedKey = `waypoint:canvas-selected:${storageKey}`;

    let storedPositions = null;
    let storedCompleted = null;
    let storedView = null;
    let storedSelected = null;

    try {
      storedPositions = window.localStorage.getItem(storedPositionsKey);
      storedCompleted = window.localStorage.getItem(storedCompletedKey);
      storedView = window.localStorage.getItem(storedViewKey);
      storedSelected = window.localStorage.getItem(storedSelectedKey);
    } catch {
      storedPositions = null;
      storedCompleted = null;
      storedView = null;
      storedSelected = null;
    }

    if (storedPositions && hasAllCanvasNodes(storedPositions)) {
      try {
        setPositions(JSON.parse(storedPositions));
      } catch {
        setPositions(initialPositions);
      }
    } else {
      setPositions(initialPositions);
    }

    if (storedCompleted) {
      try {
        setCompletedIds(new Set(JSON.parse(storedCompleted)));
      } catch {
        setCompletedIds(new Set(normalizedNodes.filter((node) => node.completed).map((node) => node.id)));
      }
    } else {
      setCompletedIds(new Set(normalizedNodes.filter((node) => node.completed).map((node) => node.id)));
    }

    if (storedView && ["canvas", "list", "timeline"].includes(storedView)) {
      setActiveView(storedView);
    }

    if (storedSelected && normalizedNodes.some((node) => node.id === storedSelected)) {
      setSelectedNodeId(storedSelected);
    } else {
      setSelectedNodeId(normalizedNodes.find((node) => !node.completed)?.id || normalizedNodes[0]?.id || null);
    }
  }, [initialPositions, normalizedNodes, storageKey]);

  useEffect(() => {
    positionsRef.current = positions;
  }, [positions]);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    panRef.current = pan;
  }, [pan]);

  useEffect(() => {
    if (!ready) return undefined;

    const shouldUseStorage = typeof storageKey === "string" && storageKey.includes(":");
    if (!shouldUseStorage) return undefined;

    const storedPositionsKey = `waypoint:canvas-positions:${storageKey}`;
    const storedCompletedKey = `waypoint:canvas-completed:${storageKey}`;
    const storedViewKey = `waypoint:canvas-view:${storageKey}`;
    const storedSelectedKey = `waypoint:canvas-selected:${storageKey}`;

    try {
      window.localStorage.setItem(storedPositionsKey, JSON.stringify(positions));
      window.localStorage.setItem(storedCompletedKey, JSON.stringify(Array.from(completedIds)));
      window.localStorage.setItem(storedViewKey, activeView);
      if (selectedNodeId) {
        window.localStorage.setItem(storedSelectedKey, selectedNodeId);
      }
    } catch {
      // Storage is optional.
    }
  }, [activeView, completedIds, positions, ready, selectedNodeId, storageKey]);

  useEffect(() => {
    const currentView = isCompactViewport && activeView === "canvas" ? "list" : activeView;
    if (currentView !== "canvas") return;
    if (Object.keys(positions).length === 0) return;
    if (!viewportSize.width || !viewportSize.height) return;
    if (didFitRef.current) return;

    const bounds = calculateBounds(positions);
    const widthScale = (viewportSize.width - 180) / Math.max(bounds.width + 160, 1);
    const heightScale = (viewportSize.height - 180) / Math.max(bounds.height + 160, 1);
    const nextScale = clamp(Math.min(widthScale, heightScale, 1.15), CANVAS_MIN_SCALE, CANVAS_MAX_SCALE);
    const nextLeft = (viewportSize.width - bounds.width * nextScale) / 2 - bounds.left * nextScale;
    const nextTop = (viewportSize.height - bounds.height * nextScale) / 2 - bounds.top * nextScale;

    setScale(nextScale);
    setPan({ left: nextLeft, top: nextTop });
    didFitRef.current = true;
  }, [activeView, isCompactViewport, positions, viewportSize.height, viewportSize.width]);

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (moveStateRef.current) {
        const dragState = moveStateRef.current;
        const deltaLeft = (event.clientX - dragState.startClientX) / scaleRef.current;
        const deltaTop = (event.clientY - dragState.startClientY) / scaleRef.current;
        const nextLeft = dragState.startPosition.left + deltaLeft;
        const nextTop = dragState.startPosition.top + deltaTop;

        setPositions((currentPositions) => ({
          ...currentPositions,
          [dragState.nodeId]: { left: nextLeft, top: nextTop },
        }));
      }

      if (panStateRef.current) {
        const panState = panStateRef.current;
        const nextLeft = panState.origin.left + (event.clientX - panState.startClientX);
        const nextTop = panState.origin.top + (event.clientY - panState.startClientY);
        setPan({ left: nextLeft, top: nextTop });
      }
    };

    const finishPointerInteraction = () => {
      if (moveStateRef.current) {
        const dragState = moveStateRef.current;
        moveStateRef.current = null;
        historyRef.current.undo.push(dragState.snapshotBeforeMove);
        historyRef.current.redo = [];
      }

      if (panStateRef.current) {
        panStateRef.current = null;
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", finishPointerInteraction);
    window.addEventListener("pointercancel", finishPointerInteraction);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", finishPointerInteraction);
      window.removeEventListener("pointercancel", finishPointerInteraction);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowLines(true), 150);
    return () => window.clearTimeout(timer);
  }, []);

  const selectedNode = normalizedNodes.find((node) => node.id === selectedNodeId) || null;
  const nextUnwatchedNode = normalizedNodes.find((node) => !completedIds.has(node.id)) || normalizedNodes[0] || null;
  const spotlightNode = selectedNode || nextUnwatchedNode;
  const completedCount = completedIds.size;
  const completionPercent = normalizedNodes.length ? Math.round((completedCount / normalizedNodes.length) * 100) : 0;
  const streakCount = calculateStreak(normalizedNodes, completedIds);
  const watchedHoursTotal = normalizedNodes.reduce((total, node) => (completedIds.has(node.id) ? total + (node.duration_seconds || 0) / 3600 : total), 0);
  const completedCountAnimated = useCountUpValue(completedCount, 850, 100);
  const completionPercentAnimated = useCountUpValue(completionPercent, 1100, 0);
  const streakAnimated = useCountUpValue(streakCount, 850, 200);
  const hoursAnimated = useCountUpValue(watchedHoursTotal, 1100, 200);

  const weeklyGroups = useMemo(() => {
    const byWeek = new Map();
    normalizedNodes.forEach((node) => {
      const key = node.week || 1;
      if (!byWeek.has(key)) {
        byWeek.set(key, { week: key, theme: key === 1 ? "Foundations" : "Models + Deployment", nodes: [] });
      }
      byWeek.get(key).nodes.push(node);
    });

    return Array.from(byWeek.values());
  }, [normalizedNodes]);

  const categories = useMemo(() => {
    const uniqueCategories = [];
    normalizedNodes.forEach((node) => {
      if (!uniqueCategories.includes(node.concept)) {
        uniqueCategories.push(node.concept);
      }
    });
    return uniqueCategories;
  }, [normalizedNodes]);

  const timelineNodes = useMemo(() => [...normalizedNodes].sort((left, right) => (left.week || 0) - (right.week || 0) || (left.day || 0) - (right.day || 0)), [normalizedNodes]);
  const outgoingLinksByNode = useMemo(() => {
    const linksByNode = new Map();
    normalizedLinks.forEach((link) => {
      if (!linksByNode.has(link.from)) {
        linksByNode.set(link.from, []);
      }
      linksByNode.get(link.from).push(link.to);
    });
    return linksByNode;
  }, [normalizedLinks]);
  const branchPointCount = useMemo(() => {
    const sources = new Set(normalizedLinks.map((link) => link.from));
    return Array.from(sources).filter((source) => (outgoingLinksByNode.get(source) || []).length > 1).length;
  }, [normalizedLinks, outgoingLinksByNode]);

  const nodePositionPairs = useMemo(() => normalizedNodes.map((node) => [node.id, positions[node.id] || initialPositions[node.id] || { left: 0, top: 0 }]), [initialPositions, normalizedNodes, positions]);
  const nodePositionLookup = useMemo(() => new Map(nodePositionPairs), [nodePositionPairs]);
  const visibleView = isCompactViewport && activeView === "canvas" ? "list" : activeView;

  useEffect(() => {
    if (visibleView === "canvas") {
      didFitRef.current = false;
    }
  }, [visibleView]);

  const markNodeComplete = (nodeId) => {
    if (!nodeId) return;

    setCompletedIds((currentCompletedIds) => {
      const nextCompletedIds = new Set(currentCompletedIds);
      nextCompletedIds.add(nodeId);
      return nextCompletedIds;
    });

    const nextNode = normalizedNodes.find((node) => node.id !== nodeId && !completedIds.has(node.id)) || normalizedNodes.find((node) => node.id !== nodeId) || null;
    setSelectedNodeId(nextNode?.id || nodeId);
  };

  const toggleNodeCompletion = (nodeId) => {
    setCompletedIds((currentCompletedIds) => {
      const nextCompletedIds = new Set(currentCompletedIds);
      if (nextCompletedIds.has(nodeId)) {
        nextCompletedIds.delete(nodeId);
      } else {
        nextCompletedIds.add(nodeId);
      }
      return nextCompletedIds;
    });
  };

  const focusNodeOnCanvas = (nodeId) => {
    const position = positionsRef.current[nodeId];
    if (!position || !viewportSize.width || !viewportSize.height) return;
    const nextLeft = viewportSize.width / 2 - (position.left + CANVAS_CARD_WIDTH / 2) * scaleRef.current;
    const nextTop = viewportSize.height / 2 - (position.top + CANVAS_CARD_HEIGHT / 2) * scaleRef.current;
    setPan({ left: nextLeft, top: nextTop });
  };

  const undoPositionChange = () => {
    const previousSnapshot = historyRef.current.undo.pop();
    if (!previousSnapshot) return;
    historyRef.current.redo.push(positionsRef.current);
    positionsRef.current = previousSnapshot;
    setPositions(previousSnapshot);
  };

  const redoPositionChange = () => {
    const nextSnapshot = historyRef.current.redo.pop();
    if (!nextSnapshot) return;
    historyRef.current.undo.push(positionsRef.current);
    positionsRef.current = nextSnapshot;
    setPositions(nextSnapshot);
  };

  const fitCanvasToScreen = () => {
    const bounds = calculateBounds(positionsRef.current);
    if (!viewportSize.width || !viewportSize.height) return;
    const widthScale = (viewportSize.width - 160) / Math.max(bounds.width + 140, 1);
    const heightScale = (viewportSize.height - 160) / Math.max(bounds.height + 140, 1);
    const nextScale = clamp(Math.min(widthScale, heightScale, 1.15), CANVAS_MIN_SCALE, CANVAS_MAX_SCALE);
    const nextLeft = (viewportSize.width - bounds.width * nextScale) / 2 - bounds.left * nextScale;
    const nextTop = (viewportSize.height - bounds.height * nextScale) / 2 - bounds.top * nextScale;
    setPan({ left: nextLeft, top: nextTop });
    setScale(nextScale);
  };

  const nudgeCanvas = (deltaX) => {
    setPan((currentPan) => ({ ...currentPan, left: currentPan.left + deltaX }));
  };

  const zoomAtPoint = (nextScale, clientX, clientY) => {
    if (!viewportRef.current) return;
    const bounds = viewportRef.current.getBoundingClientRect();
    const worldPointLeft = (clientX - bounds.left - panRef.current.left) / scaleRef.current;
    const worldPointTop = (clientY - bounds.top - panRef.current.top) / scaleRef.current;
    const clampedScale = clamp(nextScale, CANVAS_MIN_SCALE, CANVAS_MAX_SCALE);
    setScale(clampedScale);
    setPan({ left: clientX - bounds.left - worldPointLeft * clampedScale, top: clientY - bounds.top - worldPointTop * clampedScale });
  };

  const handleShare = async () => {
    const sharePayload = {
      title: `${title} | Waypoint`,
      text: `Open my Waypoint learning canvas for ${title}.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(sharePayload);
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleExport = () => {
    const exportPayload = {
      title,
      nodes: normalizedNodes,
      links: normalizedLinks,
      completedIds: Array.from(completedIds),
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
    const blobUrl = URL.createObjectURL(blob);
    const linkElement = document.createElement("a");
    linkElement.href = blobUrl;
    linkElement.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-waypoint-canvas.json`;
    linkElement.click();
    URL.revokeObjectURL(blobUrl);
  };

  const handleExportPlaylists = async () => {
    if (!curriculumId) {
      alert("Curriculum ID not available. Please try again.");
      return;
    }
    try {
      const response = await fetch(`/api/v1/curriculum/${curriculumId}/playlists`);
      if (!response.ok) throw new Error("Failed to fetch playlists");
      
      const playlistData = await response.json();
      const blob = new Blob([JSON.stringify(playlistData, null, 2)], { type: "application/json" });
      const blobUrl = URL.createObjectURL(blob);
      const linkElement = document.createElement("a");
      linkElement.href = blobUrl;
      linkElement.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-playlists.json`;
      linkElement.click();
      URL.revokeObjectURL(blobUrl);

      // Also copy YouTube playlist import URL to clipboard if available
      if (playlistData.youtube_import_url) {
        try {
          await navigator.clipboard.writeText(playlistData.youtube_import_url);
        } catch {
          console.log("Could not copy URL, but playlists exported successfully");
        }
      }
    } catch (error) {
      console.error("Error exporting playlists:", error);
      alert("Failed to export playlists. Please try again.");
    }
  };

  const handleHeaderCompletionBoard = () => {
    setSidebarPulseToken((token) => token + 1);
    if (isCompactViewport) {
      setMobileSidebarOpen(true);
    }
    setActiveView("list");
  };

  if (!ready) {
    return null;
  }

  return (
    <div className={embedded ? "relative h-full overflow-hidden bg-[color:var(--bg-primary)] text-primary" : "relative min-h-[100dvh] overflow-hidden bg-[color:var(--bg-primary)] text-primary"}>
      <header className="relative z-40 flex h-14 items-center border-b border-[color:var(--border)] bg-[color:var(--bg-secondary)] px-4 lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[4px] border border-[color:var(--border)] bg-[color:var(--bg-card)] text-[color:var(--text-secondary)] transition-colors hover:text-primary"
            aria-label="Go back"
          >
            <ArrowLeft size={14} />
          </button>
          <div className="flex min-w-0 items-center gap-2 font-mono text-[14px] text-[color:var(--text-muted)]">
            <span>Waypoint</span>
            <span className="text-[color:var(--border-hover)]">/</span>
            <span className="truncate font-semibold text-primary">{title}</span>
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-center lg:flex">
          <div className="inline-flex items-center rounded-[6px] border border-[color:var(--border)] bg-[color:var(--bg-card)] p-1">
            {[
              { id: "canvas", label: "Canvas", icon: LayoutGrid },
              { id: "list", label: "List", icon: List },
              { id: "timeline", label: "Timeline", icon: Clock3 },
            ].map((viewOption) => {
              const isActive = activeView === viewOption.id;
              const ViewIcon = viewOption.icon;

              return (
                <button
                  key={viewOption.id}
                  type="button"
                  onClick={() => setActiveView(viewOption.id)}
                  className={`inline-flex h-8 items-center gap-2 rounded-[4px] px-3 font-mono text-[12px] font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[color:var(--accent)] text-black"
                      : "border border-transparent bg-[color:var(--bg-card)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-hover)] hover:text-primary"
                  }`}
                >
                  <ViewIcon size={13} />
                  {viewOption.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex h-8 items-center gap-2 rounded-[4px] border border-[color:var(--border)] bg-transparent px-3 font-mono text-[12px] text-[color:var(--text-secondary)] transition-colors hover:text-primary"
          >
            <Share2 size={13} />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex h-8 items-center gap-2 rounded-[4px] border border-[color:var(--border)] bg-transparent px-3 font-mono text-[12px] text-[color:var(--text-secondary)] transition-colors hover:text-primary"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            type="button"
            onClick={handleExportPlaylists}
            className="inline-flex h-8 items-center gap-2 rounded-[4px] border border-[color:var(--border)] bg-transparent px-3 font-mono text-[12px] text-[color:var(--text-secondary)] transition-colors hover:text-primary"
            title="Export videos as playlists"
          >
            <Music size={13} />
            <span className="hidden sm:inline">Playlists</span>
          </button>
          <button
            type="button"
            onClick={handleHeaderCompletionBoard}
            className="inline-flex h-8 items-center gap-2 rounded-[4px] bg-[color:var(--accent)] px-3 font-mono text-[12px] font-semibold text-black transition-all hover:brightness-110"
          >
            Open completion board
          </button>
        </div>
      </header>

      <div className={embedded ? "relative h-[calc(100%-3.5rem)] lg:pr-[clamp(360px,28vw,460px)]" : "relative h-[calc(100vh-3.5rem)] lg:pr-[clamp(360px,28vw,460px)]"}>
        <main className="relative h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={visibleView} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18, ease: "easeOut" }} className="relative h-full">
              {visibleView === "canvas" ? (
                <div
                  ref={viewportRef}
                  className="relative h-full overflow-hidden touch-none cursor-grab active:cursor-grabbing bg-[color:var(--bg-primary)]"
                  style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1.1px, transparent 1.2px)", backgroundSize: "24px 24px" }}
                  onWheel={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (event.ctrlKey || event.metaKey) {
                      const zoomDirection = event.deltaY > 0 ? -0.12 : 0.12;
                      zoomAtPoint(scaleRef.current + zoomDirection, event.clientX, event.clientY);
                      return;
                    }

                    setPan((currentPan) => ({
                      left: currentPan.left - event.deltaX,
                      top: currentPan.top - event.deltaY,
                    }));
                  }}
                  onDoubleClick={(event) => {
                    const targetElement = event.target instanceof Element ? event.target : null;
                    if (targetElement?.closest("button, a, input, textarea, select, label, [role='button']")) return;
                    event.preventDefault();
                    event.stopPropagation();
                    const zoomDirection = event.altKey || event.shiftKey ? -0.18 : 0.18;
                    zoomAtPoint(scaleRef.current + zoomDirection, event.clientX, event.clientY);
                  }}
                  onPointerDown={(event) => {
                    if (event.button !== 0) return;
                    const targetElement = event.target instanceof Element ? event.target : null;
                    if (targetElement?.closest("button, a, input, textarea, select, label, [role='button']")) return;
                    panStateRef.current = {
                      startClientX: event.clientX,
                      startClientY: event.clientY,
                      origin: { ...panRef.current },
                    };
                  }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.05),transparent_30%),radial-gradient(circle_at_50%_110%,rgba(200,254,2,0.04),transparent_28%)] opacity-70" />
                  <div ref={worldRef} className="absolute left-0 top-0" style={{ width: CANVAS_WORLD_WIDTH, height: CANVAS_WORLD_HEIGHT, transformOrigin: "0 0", transform: `translate(${pan.left}px, ${pan.top}px) scale(${scale})` }}>

                    {normalizedNodes.map((node, index) => {
                      const position = positions[node.id] || initialPositions[node.id];
                      if (!position) return null;
                      const isCompleted = completedIds.has(node.id);
                      const isSelected = selectedNodeId === node.id;
                      const animationDelay = 0.6 + Math.floor(index / 2) * 0.08 + (index % 2) * 0.04;

                      return (
                        <motion.div
                          key={node.id}
                          ref={(element) => {
                            if (element) {
                              cardRefs.current.set(node.id, element);
                            } else {
                              cardRefs.current.delete(node.id);
                            }
                          }}
                          initial={{ opacity: 0, y: 14, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: isSelected ? 1.02 : 1 }}
                          transition={{ duration: 0.35, delay: animationDelay, ease: [0.22, 1, 0.36, 1] }}
                          whileHover={{ scale: isSelected ? 1.03 : 1.02 }}
                          whileTap={{ scale: 0.99 }}
                          onPointerDown={(event) => {
                            if (event.button !== 0) return;
                            event.preventDefault();
                            event.stopPropagation();
                            const startPosition = positionsRef.current[node.id];
                            if (!startPosition) return;
                            moveStateRef.current = {
                              nodeId: node.id,
                              startClientX: event.clientX,
                              startClientY: event.clientY,
                              startPosition,
                              snapshotBeforeMove: positionsRef.current,
                            };
                            event.currentTarget.setPointerCapture?.(event.pointerId);
                          }}
                          onClick={() => {
                            if (moveStateRef.current) return;
                            setSelectedNodeId(node.id);
                          }}
                          className={`group absolute overflow-hidden rounded-[8px] border text-left shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-200 ${
                            isSelected
                              ? "border-[2px] border-[color:var(--accent)] shadow-[0_18px_46px_rgba(0,0,0,0.6),0_0_30px_rgba(200,254,2,0.14)]"
                              : isCompleted
                                ? "border-[color:var(--border-hover)]"
                                : "border-[color:var(--border)]"
                          }`}
                          role="button"
                          tabIndex={0}
                          style={{ left: position.left, top: position.top, width: CANVAS_CARD_WIDTH, height: CANVAS_CARD_HEIGHT, background: "var(--bg-card)", opacity: isCompleted ? 0.58 : 1, transition: "opacity 0.25s ease-out" }}
                        >
                          <div className="relative h-16 w-full overflow-hidden">
                            <img src={getThumbnail(node)} alt={node.title} className="h-full w-full object-cover transition duration-200 group-hover:brightness-110" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
                            <div className="absolute right-2 top-2 rounded-full border border-[color:rgba(200,254,2,0.15)] bg-[color:rgba(0,0,0,0.52)] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.28em] text-[color:var(--accent)] backdrop-blur-sm">
                              STEP {String(node.day).padStart(2, "0")}
                            </div>
                            {isCompleted ? <div className="absolute left-2 top-2 rounded-full bg-[color:rgba(34,197,94,0.88)] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.24em] text-black">complete</div> : null}
                          </div>

                          <div className="flex h-[96px] flex-col gap-1 px-[10px] py-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">{node.concept}</span>
                              <span className={`font-mono text-[10px] ${node.score >= 70 ? "text-[color:var(--accent)]" : "text-[color:var(--text-secondary)]"}`}>{node.score}%</span>
                            </div>

                            <p className="text-[11px] font-semibold leading-[1.3] text-primary" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {node.title}
                            </p>

                            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                              {node.channel} · {formatDuration(node.duration_seconds)}
                            </p>

                            <div className="mt-auto flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedNodeId(node.id);
                                  setWatchingNodeId(node.id);
                                }}
                                className="inline-flex h-5 items-center rounded-[3px] bg-[color:var(--accent)] px-2 font-mono text-[9px] font-semibold text-black transition-colors hover:brightness-110"
                              >
                                Watch
                              </button>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedNodeId(node.id);
                                  focusNodeOnCanvas(node.id);
                                }}
                                className="inline-flex h-5 items-center rounded-[3px] border border-[color:var(--border)] bg-[color:var(--bg-secondary)] px-2 font-mono text-[9px] text-[color:var(--text-secondary)] transition-colors hover:border-[color:var(--border-hover)] hover:text-primary"
                              >
                                Drag
                              </button>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedNodeId(node.id);
                                  focusNodeOnCanvas(node.id);
                                }}
                                className="inline-flex h-5 items-center rounded-[3px] border border-[color:var(--border)] bg-[color:var(--bg-secondary)] px-2 font-mono text-[9px] text-[color:var(--text-secondary)] transition-colors hover:border-[color:var(--border-hover)] hover:text-primary"
                              >
                                Flow
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* SVG Layer - Arrows rendered on top of cards */}
                    <svg className="absolute inset-0 h-full w-full overflow-visible pointer-events-none z-20" viewBox={`0 0 ${CANVAS_WORLD_WIDTH} ${CANVAS_WORLD_HEIGHT}`}>
                      <defs>
                        <marker id="waypoint-arrow-muted" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                          <path d="M 0 0 L 6 3 L 0 6 z" fill="rgba(255,255,255,0.5)" />
                        </marker>
                        <marker id="waypoint-arrow-accent" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                          <path d="M 0 0 L 6 3 L 0 6 z" fill="rgb(200, 254, 2)" />
                        </marker>
                        <filter id="waypoint-glow">
                          <feGaussianBlur stdDeviation="2.4" result="coloredBlur" />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {normalizedLinks.map((link, index) => {
                        const sourceNode = normalizedNodes.find((node) => node.id === link.from);
                        const targetNode = normalizedNodes.find((node) => node.id === link.to);
                        if (!sourceNode || !targetNode) return null;

                        const sourcePosition = positions[sourceNode.id];
                        const targetPosition = positions[targetNode.id];
                        if (!sourcePosition || !targetPosition) return null;

                        const isActive = completedIds.has(sourceNode.id) || completedIds.has(targetNode.id) || selectedNodeId === sourceNode.id || selectedNodeId === targetNode.id;
                        const pathDefinition = buildCurvedPath(sourcePosition, targetPosition);

                        return (
                          <g key={link.id}>
                            <motion.path
                              d={pathDefinition}
                              fill="none"
                              stroke={isActive ? "rgb(200, 254, 2)" : "rgba(255,255,255,0.24)"}
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              markerEnd={`url(#${isActive ? "waypoint-arrow-accent" : "waypoint-arrow-muted"})`}
                              style={{ filter: isActive ? "url(#waypoint-glow)" : "none" }}
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={showLines ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                              transition={{ duration: 1.5, delay: 0.42 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  <MiniMap
                    nodes={normalizedNodes}
                    positions={positions}
                    viewportSize={viewportSize}
                    pan={pan}
                    scale={scale}
                    onNavigate={({ relativeX, relativeY }) => {
                      const worldLeft = relativeX * CANVAS_WORLD_WIDTH;
                      const worldTop = relativeY * CANVAS_WORLD_HEIGHT;
                      const nextPan = {
                        left: viewportSize.width / 2 - worldLeft * scaleRef.current,
                        top: viewportSize.height / 2 - worldTop * scaleRef.current,
                      };
                      setPan(nextPan);
                    }}
                  />

                  <div className="absolute bottom-4 right-4 z-30 flex items-center rounded-[8px] border border-[color:var(--border)] bg-[color:var(--bg-card)] p-1 shadow-[0_18px_50px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center border-r border-[color:var(--border)] pr-1.5">
                      <IconButton icon={ArrowLeft} label="Move left" onClick={() => nudgeCanvas(-180)} />
                      <IconButton icon={ArrowRight} label="Move right" onClick={() => nudgeCanvas(180)} />
                      <IconButton icon={ZoomOut} label="Zoom out" onClick={() => zoomAtPoint(scaleRef.current - 0.12, viewportSize.width / 2, viewportSize.height / 2)} />
                      <IconButton icon={ZoomIn} label="Zoom in" onClick={() => zoomAtPoint(scaleRef.current + 0.12, viewportSize.width / 2, viewportSize.height / 2)} />
                      <IconButton icon={Maximize2} label="Fit to screen" onClick={fitCanvasToScreen} />
                    </div>
                    <div className="flex items-center pl-1.5">
                      <IconButton icon={Undo2} label="Undo" onClick={undoPositionChange} />
                      <IconButton icon={Redo2} label="Redo" onClick={redoPositionChange} />
                    </div>
                  </div>
                  <div className="absolute bottom-16 right-4 z-30 rounded-[8px] border border-[color:var(--border)] bg-[color:rgba(17,17,17,0.92)] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.28em] text-[color:var(--text-secondary)] shadow-[0_14px_30px_rgba(0,0,0,0.35)]">
                    Pinch or ctrl-scroll to zoom · double-click to zoom in
                  </div>
                </div>
              ) : visibleView === "list" ? (
                <div className="h-full overflow-auto px-4 py-5 lg:px-8 lg:py-8">
                  <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-10 pb-16">
                    {weeklyGroups.map((weekGroup) => {
                      const weekCompleted = weekGroup.nodes.filter((node) => completedIds.has(node.id)).length;
                      const weekProgress = weekGroup.nodes.length ? Math.round((weekCompleted / weekGroup.nodes.length) * 100) : 0;
                      const isExpanded = expandedWeeks.includes(weekGroup.week);

                      return (
                        <section key={weekGroup.week} className="space-y-4 rounded-[24px] border border-[color:var(--border)] bg-[color:rgba(17,17,17,0.72)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:p-6">
                          <button
                            type="button"
                            onClick={() => {
                              setExpandedWeeks((currentWeeks) =>
                                currentWeeks.includes(weekGroup.week) ? currentWeeks.filter((weekNumber) => weekNumber !== weekGroup.week) : [...currentWeeks, weekGroup.week],
                              );
                            }}
                            className="flex w-full items-start justify-between gap-4 text-left"
                          >
                            <div>
                              <h2 className="font-display text-[2rem] leading-none text-[color:var(--text-muted)] lg:text-[2.5rem]">Week {String(weekGroup.week).padStart(2, "0")}</h2>
                              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.32em] text-[color:var(--accent)]">{weekGroup.theme}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">
                                {weekCompleted}/{weekGroup.nodes.length} complete
                              </p>
                              <div className="mt-2 h-1.5 w-36 overflow-hidden rounded-full bg-[color:var(--bg-secondary)]">
                                <div className="h-full rounded-full bg-[color:var(--accent)]" style={{ width: `${weekProgress}%` }} />
                              </div>
                            </div>
                          </button>

                          <AnimatePresence initial={false}>
                            {isExpanded ? (
                              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.18 }} className="space-y-3">
                                {weekGroup.nodes.map((node) => {
                                  const isCompleted = completedIds.has(node.id);
                                  const isSelected = selectedNodeId === node.id;

                                  return (
                                    <div
                                      key={node.id}
                                      onClick={() => setSelectedNodeId(node.id)}
                                      className={`flex w-full items-center gap-3 rounded-[16px] border px-3 py-3 text-left transition-all duration-200 ${
                                        isSelected
                                          ? "border-[color:var(--accent)] bg-[color:rgba(200,254,2,0.05)]"
                                          : "border-[color:var(--border)] bg-[color:var(--bg-card)] hover:border-[color:var(--border-hover)]"
                                      } ${isCompleted ? "opacity-80" : "opacity-100"}`}
                                    >
                                      <span className="min-w-[52px] font-mono text-[12px] uppercase tracking-[0.26em] text-[color:var(--text-secondary)]">{formatDayLabel(node.day)}</span>
                                      <img src={getThumbnail(node)} alt={node.title} className="h-12 w-20 rounded-[4px] object-cover" loading="lazy" />
                                      <div className="min-w-0 flex-1">
                                        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--accent)]">{node.concept}</p>
                                        <p className="mt-1 truncate text-[14px] font-semibold leading-5 text-primary">{node.title}</p>
                                        <p className="mt-1 font-mono text-[11px] text-[color:var(--text-secondary)]">
                                          {node.channel} · {formatDuration(node.duration_seconds)}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono text-[10px] text-[color:var(--text-secondary)]">{node.score}%</span>
                                        <button
                                          type="button"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedNodeId(node.id);
                                            setWatchingNodeId(node.id);
                                          }}
                                          className="inline-flex h-8 items-center rounded-[4px] bg-[color:var(--accent)] px-3 font-mono text-[11px] font-semibold text-black transition-all hover:brightness-110"
                                        >
                                          Watch
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            toggleNodeCompletion(node.id);
                                          }}
                                          className={`inline-flex h-8 w-8 items-center justify-center rounded-[4px] border border-[color:var(--border)] bg-transparent text-[color:var(--text-secondary)] transition-colors hover:text-primary ${
                                            isCompleted ? "text-[color:var(--success)]" : ""
                                          }`}
                                          aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
                                        >
                                          <Check size={14} />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </section>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="h-full overflow-auto px-4 py-5 lg:px-8 lg:py-8">
                  <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 pb-20">
                    <div className="rounded-[30px] border border-[color:rgba(200,254,2,0.12)] bg-[linear-gradient(180deg,rgba(18,18,18,0.92),rgba(15,15,15,0.8))] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur-xl lg:p-6">
                      <div className="flex flex-col gap-4 border-b border-[color:var(--border)] pb-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.38em] text-[color:var(--accent)]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)] shadow-[0_0_18px_rgba(200,254,2,0.55)]" />
                            Timeline
                          </div>
                          <h2 className="mt-3 font-display text-[2rem] leading-none text-primary lg:text-[2.75rem]">Course arc</h2>
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--text-secondary)]">
                            A compact overview of the day-by-day path, with the sequence and branches visible up front.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-card)] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-[color:var(--text-secondary)]">
                            {timelineNodes.length} days
                          </span>
                          <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-card)] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-[color:var(--text-secondary)]">
                            {branchPointCount} branch points
                          </span>
                          <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--bg-card)] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-[color:var(--text-secondary)]">
                            {Math.round(normalizedNodes.reduce((sum, node) => sum + (node.duration_seconds || 0), 0) / 3600)}h video
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 rounded-[24px] border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] p-4 lg:p-5">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[color:var(--text-secondary)]">Sequence rail</p>
                            <p className="mt-1 text-sm text-primary">The path with its branch-offs.</p>
                          </div>
                          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">Tap a card to focus it in the canvas</p>
                        </div>

                        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                          {timelineNodes.map((node, index) => {
                            const nextTargets = outgoingLinksByNode.get(node.id) || [];
                            return (
                              <div key={`timeline-rail-${node.id}`} className="flex min-w-[210px] items-stretch gap-3">
                                <button
                                  type="button"
                                  onClick={() => setSelectedNodeId(node.id)}
                                  className={`group flex flex-1 flex-col rounded-[18px] border px-4 py-4 text-left transition-all ${
                                    selectedNodeId === node.id ? "border-[color:var(--accent)] bg-[color:rgba(200,254,2,0.08)]" : "border-[color:var(--border)] bg-[color:var(--bg-card)] hover:border-[color:var(--border-hover)]"
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">Day {String(node.day).padStart(2, "0")}</span>
                                    <span className="rounded-full border border-[color:rgba(200,254,2,0.14)] bg-[color:rgba(200,254,2,0.08)] px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.24em] text-[color:var(--accent)]">
                                      {formatDuration(node.duration_seconds)}
                                    </span>
                                  </div>
                                  <p className="mt-3 line-clamp-2 text-sm font-semibold leading-5 text-primary">{node.title}</p>
                                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.22em] text-[color:var(--text-secondary)]">{node.concept}</p>
                                  <div className="mt-3 flex flex-wrap gap-1.5">
                                    {nextTargets.length ? nextTargets.map((targetId) => {
                                      const targetNode = normalizedNodes.find((entry) => entry.id === targetId);
                                      return targetNode ? (
                                        <span key={`${node.id}-${targetId}`} className="inline-flex items-center gap-1 rounded-full border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] px-2 py-1 font-mono text-[8px] uppercase tracking-[0.22em] text-[color:var(--text-secondary)]">
                                          <ArrowRight size={10} className="text-[color:var(--accent)]" />
                                          {targetNode.concept}
                                        </span>
                                      ) : null;
                                    }) : (
                                      <span className="rounded-full border border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] px-2 py-1 font-mono text-[8px] uppercase tracking-[0.22em] text-[color:var(--text-secondary)]">
                                        End of branch
                                      </span>
                                    )}
                                  </div>
                                </button>
                                {index < timelineNodes.length - 1 ? (
                                  <div className="flex items-center">
                                    <ArrowRight className="text-[color:var(--accent)]/80" size={18} />
                                  </div>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-5 min-w-[900px] overflow-hidden rounded-[22px] border border-[color:var(--border)] bg-[color:var(--bg-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                        <div className="grid grid-cols-[180px_repeat(8,minmax(0,1fr))] border-b border-[color:var(--border)] bg-[color:rgba(255,255,255,0.03)] px-4 py-3 font-mono text-[9px] uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">
                          <div>Track</div>
                          {timelineNodes.map((node) => (
                            <div key={`axis-${node.id}`} className="text-center">
                              {String(node.day).padStart(2, "0")}
                            </div>
                          ))}
                        </div>

                        <div className="relative">
                          {categories.map((category, categoryIndex) => {
                            const categoryNodes = timelineNodes.filter((node) => node.concept === category);

                            return (
                              <div key={category} className={`grid grid-cols-[180px_repeat(8,minmax(0,1fr))] border-b border-[color:var(--border)] last:border-b-0 ${categoryIndex % 2 === 0 ? "bg-[color:rgba(255,255,255,0.015)]" : "bg-transparent"}`}>
                                <div className="border-r border-[color:var(--border)] p-4">
                                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--accent)]">{category}</p>
                                  <p className="mt-2 text-sm text-[color:var(--text-secondary)]">Focused sequence</p>
                                </div>
                                <div className="relative col-span-8 min-h-[96px]">
                                  {categoryNodes.map((node) => {
                                    const dayIndex = timelineNodes.findIndex((entry) => entry.id === node.id);
                                    const isCompleted = completedIds.has(node.id);
                                    const isSelected = selectedNodeId === node.id;
                                    const barColor = resolveConceptTone(node.concept);

                                    return (
                                      <button
                                        key={node.id}
                                        type="button"
                                        onMouseEnter={(event) => {
                                          const barBounds = event.currentTarget.getBoundingClientRect();
                                          setTimelineTooltip({ node, left: barBounds.left + barBounds.width / 2, top: barBounds.top - 18 });
                                        }}
                                        onMouseMove={(event) => {
                                          const barBounds = event.currentTarget.getBoundingClientRect();
                                          setTimelineTooltip({ node, left: barBounds.left + barBounds.width / 2, top: barBounds.top - 18 });
                                        }}
                                        onMouseLeave={() => setTimelineTooltip(null)}
                                        onClick={() => setSelectedNodeId(node.id)}
                                        className={`absolute top-5 rounded-[12px] border px-3 py-2 text-left shadow-[0_10px_26px_rgba(0,0,0,0.26)] transition-all duration-200 ${
                                          isSelected ? "border-[color:var(--accent)] shadow-[0_12px_30px_rgba(0,0,0,0.3),0_0_22px_rgba(200,254,2,0.12)]" : "border-[color:rgba(255,255,255,0.08)]"
                                        }`}
                                        style={{
                                          left: `${dayIndex * (100 / timelineNodes.length)}%`,
                                          width: `${100 / timelineNodes.length - 1.5}%`,
                                          background: `linear-gradient(90deg, ${barColor}, rgba(17,17,17,0.92))`,
                                          opacity: isCompleted ? 1 : 0.72,
                                        }}
                                      >
                                        <p className="truncate font-mono text-[9px] uppercase tracking-[0.24em] text-black/85">{node.concept}</p>
                                        <p className="mt-1 truncate text-[12px] font-semibold leading-4 text-white">{node.title}</p>
                                        <p className="mt-1 truncate font-mono text-[9px] uppercase tracking-[0.18em] text-white/70">
                                          {node.channel} · {formatDuration(node.duration_seconds)} · {node.score}%
                                        </p>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <aside className={`${embedded ? "absolute" : "fixed"} right-0 top-14 hidden h-[calc(100vh-3.5rem)] overflow-y-auto border-l border-[color:var(--border)] bg-[color:var(--bg-secondary)] lg:block ${sidebarPulseToken ? "shadow-[inset_0_0_0_1px_rgba(200,254,2,0.15)]" : ""}`} style={{ width: SIDEBAR_WIDTH }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="h-full p-6">
            <SidebarContent
              title={title}
              nodes={normalizedNodes}
              completedIds={completedIds}
              selectedNode={spotlightNode}
              completionPercent={completionPercentAnimated}
              completedCount={completedCountAnimated}
              streakCount={streakAnimated}
              hoursWatched={hoursAnimated}
              weeklyGroups={weeklyGroups}
              expandedWeeks={expandedWeeks}
              setExpandedWeeks={setExpandedWeeks}
              onWatch={(node) => {
                setSelectedNodeId(node.id);
                setWatchingNodeId(node.id);
              }}
              onMarkComplete={() => {
                if (!spotlightNode) return;
                markNodeComplete(spotlightNode.id);
              }}
              onReset={() => setCompletedIds(new Set())}
            />
          </motion.div>
        </aside>
      </div>

      <AnimatePresence>
        {isCompactViewport ? (
          <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} transition={{ duration: 0.18 }} className={`${embedded ? "absolute" : "fixed"} bottom-4 right-4 z-50 lg:hidden`}>
            <AnimatePresence initial={false} mode="wait">
              {mobileSidebarOpen ? (
                <motion.div
                  key="mobile-sidebar-panel"
                  initial={{ y: 16, opacity: 0, scale: 0.98 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 16, opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="w-[min(92vw,24rem)] overflow-hidden rounded-[22px] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(18,18,18,0.98),rgba(12,12,12,0.96))] shadow-[0_24px_60px_rgba(0,0,0,0.48)] backdrop-blur-xl"
                >
                  <button type="button" onClick={() => setMobileSidebarOpen(false)} className="flex w-full items-center justify-between border-b border-[color:var(--border)] px-4 py-3 text-left">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[color:var(--text-secondary)]">Progress</p>
                      <p className="mt-1 text-[15px] font-semibold text-primary">{title}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-[1.45rem] text-[color:var(--accent)]">{Math.round(completionPercentAnimated)}%</span>
                      <ArrowRight className="rotate-90 transition-transform duration-200" size={16} />
                    </div>
                  </button>
                  <div className="max-h-[min(58vh,32rem)] overflow-auto p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                    <SidebarContent
                      title={title}
                      nodes={normalizedNodes}
                      completedIds={completedIds}
                      selectedNode={spotlightNode}
                      completionPercent={completionPercentAnimated}
                      completedCount={completedCountAnimated}
                      streakCount={streakAnimated}
                      hoursWatched={hoursAnimated}
                      weeklyGroups={weeklyGroups}
                      expandedWeeks={expandedWeeks}
                      setExpandedWeeks={setExpandedWeeks}
                      onWatch={(node) => {
                        setSelectedNodeId(node.id);
                        setWatchingNodeId(node.id);
                      }}
                      onMarkComplete={() => {
                        if (!spotlightNode) return;
                        markNodeComplete(spotlightNode.id);
                      }}
                      onReset={() => setCompletedIds(new Set())}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="mobile-sidebar-button"
                  type="button"
                  onClick={() => setMobileSidebarOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:rgba(12,12,12,0.92)] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.32em] text-primary shadow-[0_18px_42px_rgba(0,0,0,0.42)] backdrop-blur-xl"
                >
                  <span className="text-[color:var(--accent)]">{Math.round(completionPercentAnimated)}%</span>
                  <span>Progress</span>
                  <ArrowRight size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {watchingNodeId ? (
          <VideoPlayer
            isOpen={Boolean(watchingNodeId)}
            youtubeId={normalizedNodes.find((node) => node.id === watchingNodeId)?.youtube_id || "GwIo3gDZCVQ"}
            title={normalizedNodes.find((node) => node.id === watchingNodeId)?.title || DEFAULT_CURRICULUM_TITLE}
            context={{
              topic: title,
              weekLabel: `Week ${String(normalizedNodes.find((node) => node.id === watchingNodeId)?.week || 1).padStart(2, "0")}`,
              dayLabel: formatDayLabel(normalizedNodes.find((node) => node.id === watchingNodeId)?.day || 1),
              concept: normalizedNodes.find((node) => node.id === watchingNodeId)?.concept,
              channel: normalizedNodes.find((node) => node.id === watchingNodeId)?.channel,
              durationLabel: formatDuration(normalizedNodes.find((node) => node.id === watchingNodeId)?.duration_seconds),
              scoreLabel: `${normalizedNodes.find((node) => node.id === watchingNodeId)?.score || 0}%`,
              whyThisVideo: "This lesson is positioned in the sequence to move the curriculum forward with the next concept.",
              projectTitle: title,
              projectDescription: "A structured machine learning path with a clear progression from intuition to deployment.",
              transcriptAvailable: true,
              durationAdvice: "Aim to complete the watch session in one sitting, then mark the lesson complete to unlock the next step.",
            }}
            onClose={() => setWatchingNodeId(null)}
            onComplete={() => {
              if (watchingNodeId) {
                markNodeComplete(watchingNodeId);
              }
              setWatchingNodeId(null);
            }}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {timelineTooltip ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none fixed z-[60] rounded-[12px] border border-[color:var(--border)] bg-[color:var(--bg-card)] px-3 py-2 shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
            style={{ left: timelineTooltip.left - 120, top: timelineTooltip.top - 76, width: 240 }}
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-[color:var(--accent)]">{timelineTooltip.node.concept}</p>
            <p className="mt-1 text-[13px] font-semibold text-primary">{timelineTooltip.node.title}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
              {timelineTooltip.node.channel} · {formatDuration(timelineTooltip.node.duration_seconds)} · {timelineTooltip.node.score}%
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
