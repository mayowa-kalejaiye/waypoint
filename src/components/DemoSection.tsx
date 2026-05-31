"use client";

import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import CanvasResultPage from "./CanvasResults";

type TopicKey = "react" | "python" | "system-design" | "guitar" | "photography" | "data-science" | "uiux" | "product-strategy";

type DayRow = {
  day: string;
  concept: string;
  title: string;
  channel: string;
  duration: string;
  score: number;
  completed?: boolean;
};

type TopicDemo = {
  key: TopicKey;
  label: string;
  pathTitle: string;
  pathMeta: string;
  week: string;
  weekTitle: string;
  days: DayRow[];
  tracker: {
    completed: number;
    total: number;
    streak: number;
    videosCompleted: number;
    remainingHours: string;
  };
  reasoning: {
    title: string;
    channel: string;
    score: string;
    text: string;
  };
};

const TOPICS: TopicDemo[] = [
  {
    key: "react",
    label: "React",
    pathTitle: "React Basics",
    pathMeta: "Beginner · 4 days",
    week: "01",
    weekTitle: "Components & Hooks",
    days: [
      { day: "Day 01", concept: "JSX", title: "Intro to React Components", channel: "Traversy Media · 9 min", duration: "9 min", score: 68, completed: true },
      { day: "Day 02", concept: "JSX & COMPONENTS", title: "React Components Deep Dive", channel: "Traversy Media · 9 min", duration: "9 min", score: 72 },
      { day: "Day 03", concept: "HOOKS", title: "React Hooks Tutorial", channel: "The Net Ninja · 8 min", duration: "8 min", score: 78 },
    ],
    tracker: { completed: 1, total: 3, streak: 1, videosCompleted: 1, remainingHours: "3.0h remaining" },
    reasoning: {
      title: "React Hooks Tutorial",
      channel: "The Net Ninja · 8 min",
      score: "78%",
      text: "Selected because it covers useState and useEffect sequentially, matching your current concept node. Beginner-friendly pacing confirmed via transcript analysis. Strong completion rate among learners at this stage.",
    },
  },
  {
    key: "python",
    label: "Python",
    pathTitle: "Python for Data Science",
    pathMeta: "Intermediate · 5 days",
    week: "01",
    weekTitle: "NumPy & Pandas",
    days: [
      { day: "Day 01", concept: "NUMPY ARRAYS", title: "NumPy Tutorial for Beginners", channel: "Data School · 10 min", duration: "10 min", score: 68, completed: true },
      { day: "Day 02", concept: "PANDAS DATAFRAMES", title: "Pandas Tutorial - Data Manipulation", channel: "Corey Schafer · 13 min", duration: "13 min", score: 74 },
      { day: "Day 03", concept: "VISUALIZATION", title: "Matplotlib & Seaborn Visualization", channel: "StatQuest · 10 min", duration: "10 min", score: 80 },
    ],
    tracker: { completed: 1, total: 3, streak: 1, videosCompleted: 1, remainingHours: "3.5h remaining" },
    reasoning: {
      title: "Pandas Tutorial - Data Manipulation",
      channel: "Corey Schafer · 13 min",
      score: "74%",
      text: "Chosen for a clean dependency jump from arrays to tabular data. Transcript signals show strong pacing for intermediate learners, with low friction between examples and concepts.",
    },
  },
  {
    key: "system-design",
    label: "System Design",
    pathTitle: "System Design Fundamentals",
    pathMeta: "Intermediate · 6 days",
    week: "01",
    weekTitle: "Scalability & Tradeoffs",
    days: [
      { day: "Day 01", concept: "API BASICS", title: "System Design Interview Foundations", channel: "Gaurav Sen · 12 min", duration: "12 min", score: 64, completed: true },
      { day: "Day 02", concept: "DATABASES", title: "SQL vs NoSQL Tradeoffs", channel: "ByteByteGo · 9 min", duration: "9 min", score: 71 },
      { day: "Day 03", concept: "CACHE STRATEGIES", title: "Caching and Load Balancing Explained", channel: "TechWorld with Nana · 10 min", duration: "10 min", score: 77 },
    ],
    tracker: { completed: 1, total: 3, streak: 1, videosCompleted: 1, remainingHours: "4.5h remaining" },
    reasoning: {
      title: "Caching and Load Balancing Explained",
      channel: "TechWorld with Nana · 10 min",
      score: "77%",
      text: "Selected because it sits after the database tradeoff node and before distributed scaling patterns. The sequence keeps the learning curve smooth while preserving interview-ready depth.",
    },
  },
  {
    key: "guitar",
    label: "Guitar",
    pathTitle: "Guitar for Beginners",
    pathMeta: "Beginner · 7 days",
    week: "01",
    weekTitle: "Chords & Rhythm",
    days: [
      { day: "Day 01", concept: "OPEN CHORDS", title: "Learn Open Chords Fast", channel: "FenderPlay · 9 min", duration: "9 min", score: 70, completed: true },
      { day: "Day 02", concept: "RHYTHM", title: "Strumming Patterns for Beginners", channel: "JustinGuitar · 8 min", duration: "8 min", score: 73 },
      { day: "Day 03", concept: "SWITCHING CHORDS", title: "Chord Changes Without the Pause", channel: "Marty Music · 7 min", duration: "7 min", score: 79 },
    ],
    tracker: { completed: 1, total: 3, streak: 1, videosCompleted: 1, remainingHours: "2.5h remaining" },
    reasoning: {
      title: "Chord Changes Without the Pause",
      channel: "Marty Music · 7 min",
      score: "79%",
      text: "Picked because it reinforces chord switching immediately after rhythm practice. That keeps muscle memory and timing tied together rather than split across unrelated lessons.",
    },
  },
  {
    key: "photography",
    label: "Photography",
    pathTitle: "Photography Fundamentals",
    pathMeta: "Beginner · 5 days",
    week: "01",
    weekTitle: "Exposure & Composition",
    days: [
      { day: "Day 01", concept: "EXPOSURE TRIANGLE", title: "Exposure Triangle Explained", channel: "Andrew K. · 11 min", duration: "11 min", score: 66, completed: true },
      { day: "Day 02", concept: "COMPOSITION", title: "Composition Rules That Actually Help", channel: "Peter McKinnon · 8 min", duration: "8 min", score: 75 },
      { day: "Day 03", concept: "LIGHT", title: "Using Natural Light Better", channel: "Jessica Kobeissi · 9 min", duration: "9 min", score: 81 },
    ],
    tracker: { completed: 1, total: 3, streak: 1, videosCompleted: 1, remainingHours: "2.0h remaining" },
    reasoning: {
      title: "Using Natural Light Better",
      channel: "Jessica Kobeissi · 9 min",
      score: "81%",
      text: "Recommended because it builds on exposure and composition before introducing a more advanced lighting model. Learners at this point usually benefit from a practical, visual example.",
    },
  },
  {
    key: "data-science",
    label: "Data Science",
    pathTitle: "Data Science Path",
    pathMeta: "Intermediate · 6 days",
    week: "01",
    weekTitle: "Analysis Workflow",
    days: [
      { day: "Day 01", concept: "DATA CLEANING", title: "Cleaning Messy Datasets", channel: "Data School · 12 min", duration: "12 min", score: 69, completed: true },
      { day: "Day 02", concept: "EXPLORATION", title: "EDA That Finds Real Patterns", channel: "Ken Jee · 10 min", duration: "10 min", score: 74 },
      { day: "Day 03", concept: "MODELING", title: "From Features to First Model", channel: "StatQuest · 11 min", duration: "11 min", score: 79 },
    ],
    tracker: { completed: 1, total: 3, streak: 1, videosCompleted: 1, remainingHours: "3.2h remaining" },
    reasoning: {
      title: "From Features to First Model",
      channel: "StatQuest · 11 min",
      score: "79%",
      text: "Selected because it bridges exploratory work into modeling without skipping the feature-thinking step. That keeps the curriculum practical and methodical.",
    },
  },
  {
    key: "uiux",
    label: "UI/UX",
    pathTitle: "UI/UX Systems",
    pathMeta: "Beginner · 4 days",
    week: "01",
    weekTitle: "Layout & Interaction",
    days: [
      { day: "Day 01", concept: "LAYOUT", title: "Designing with Grids", channel: "Figma · 7 min", duration: "7 min", score: 67, completed: true },
      { day: "Day 02", concept: "TYPE", title: "Hierarchy That Guides Attention", channel: "The Futur · 9 min", duration: "9 min", score: 73 },
      { day: "Day 03", concept: "INTERACTION", title: "Micro-interactions That Matter", channel: "Flux Academy · 8 min", duration: "8 min", score: 77 },
    ],
    tracker: { completed: 1, total: 3, streak: 1, videosCompleted: 1, remainingHours: "1.8h remaining" },
    reasoning: {
      title: "Micro-interactions That Matter",
      channel: "Flux Academy · 8 min",
      score: "77%",
      text: "Chosen because it comes after hierarchy and layout, so the learner is ready to think about motion and feedback rather than visual basics alone.",
    },
  },
  {
    key: "product-strategy",
    label: "Product Strategy",
    pathTitle: "Product Strategy Basics",
    pathMeta: "Intermediate · 6 days",
    week: "01",
    weekTitle: "Research & Positioning",
    days: [
      { day: "Day 01", concept: "RESEARCH", title: "Customer interview basics", channel: "HBR · 12 min", duration: "10 min", score: 68, completed: true },
      { day: "Day 02", concept: "POSITIONING", title: "Positioning that actually lands", channel: "Toastmasters · 14 min", duration: "12 min", score: 74 },
      { day: "Day 03", concept: "VALIDATION", title: "How to test a launch message", channel: "Strategyzer · 11 min", duration: "9 min", score: 80 },
    ],
    tracker: { completed: 1, total: 3, streak: 1, videosCompleted: 1, remainingHours: "4.1h remaining" },
    reasoning: {
      title: "How to test a launch message",
      channel: "Strategyzer · 11 min",
      score: "80%",
      text: "Prioritized because it reinforces validation before the path expands further. That helps the learner keep the right mental model before tackling more complex examples.",
    },
  },
];

function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.22 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [inView]);

  return { ref, inView };
}

function useCountUp(target: number, active: boolean, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }

    let animationFrame = 0;
    const startedAt = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      }
    };

    animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [active, duration, target]);

  return value;
}

function TopicPill({
  label,
  active,
  delay,
  onClick,
}: {
  label: string;
  active: boolean;
  delay: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      className={`whitespace-nowrap rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.35em] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)] ${
        active
          ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-black"
          : "border-[color:var(--border)] bg-[color:var(--card)] text-[#999999] hover:border-[#2a2a2a] hover:text-white"
      }`}
    >
      {label}
    </motion.button>
  );
}

function DayRow({ day, active, visible }: { day: DayRow; active: boolean; visible: boolean }) {
  const score = useCountUp(day.score, visible, 700);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group rounded-[18px] border-l-2 border-transparent bg-[color:rgba(255,255,255,0.015)] px-3 py-3 transition-colors hover:border-l-[color:var(--accent)] hover:bg-[color:rgba(255,255,255,0.04)] sm:px-4"
    >
      <motion.div
        animate={active ? { opacity: [0.18, 0.45, 0.18], x: [0, 6, 0] } : { opacity: 0.1 }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="mb-3 h-px origin-left bg-[linear-gradient(90deg,rgba(200,254,2,0.85),rgba(200,254,2,0.08))]"
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#999999] sm:tracking-[0.35em]">{day.day}</p>
            {active ? <Check className="h-4 w-4 text-[color:var(--accent)]" /> : <Circle className="h-3.5 w-3.5 text-white" />}
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#444444] sm:tracking-[0.32em]">{day.concept}</p>
          <p className="truncate text-sm text-white">{day.title}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#999999] sm:tracking-[0.28em]">{day.channel}</p>
        </div>

        <div className="flex w-full items-center justify-between gap-3 pt-0 sm:w-28 sm:flex-col sm:items-end sm:gap-2 sm:pt-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#999999] sm:tracking-[0.3em]">{score}%</span>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1E1E1E] sm:hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={visible ? { width: `${day.score}%` } : { width: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="h-full rounded-full bg-[color:var(--accent)]"
            />
          </div>

          <div className="hidden h-12 w-1.5 overflow-hidden rounded-full bg-[#1E1E1E] sm:block">
            <motion.div
              initial={{ height: 0 }}
              animate={visible ? { height: `${day.score}%` } : { height: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="w-full rounded-full bg-[color:var(--accent)]"
            />
          </div>

          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#999999] sm:tracking-[0.28em]">{day.duration}</span>
        </div>
      </div>
    </motion.div>
  );
}

function DemoCard({ topic, nodes, links, visible }: { topic: TopicDemo; nodes: any[]; links: any[]; visible: boolean }) {
  return (
    <motion.div
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      className="overflow-hidden rounded-[40px] border border-subtle bg-[color:var(--surface)] shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
    >
        <div className="h-[1120px] overflow-hidden lg:h-[980px]">
        <CanvasResultPage embedded title={topic.pathTitle} nodes={nodes} links={links} />
      </div>
    </motion.div>
  );
}

export default function DemoSection() {
  const { ref, inView } = useInViewOnce<HTMLElement>();
  const [selectedTopic, setSelectedTopic] = useState<TopicKey>("react");

  const topic = useMemo(() => TOPICS.find((item) => item.key === selectedTopic) ?? TOPICS[0], [selectedTopic]);

  function topicToCanvasNodes(t: TopicDemo) {
    return t.days.map((d, idx) => ({
      id: `${t.key}-${String(idx + 1).padStart(2, "0")}`,
      week: parseInt(t.week, 10) || 1,
      day: idx + 1,
      concept: d.concept,
      title: d.title,
      channel: d.channel.split(" · ")[0] || d.channel,
      duration_seconds: (parseInt(String(d.duration).replace(/[^0-9]/g, "")) || 0) * 60,
      score: d.score,
      youtube_id: undefined,
      thumbnail_url: undefined,
      completed: !!d.completed,
    }));
  }

  function topicToCanvasLinks(t: TopicDemo) {
    const nodes = topicToCanvasNodes(t);
    const links = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      links.push({ id: `link-${nodes[i].id}-${nodes[i + 1].id}`, from: nodes[i].id, to: nodes[i + 1].id });
    }
    return links;
  }

  const demoNodes = useMemo(() => topicToCanvasNodes(topic), [topic]);
  const demoLinks = useMemo(() => topicToCanvasLinks(topic), [topic]);

  return (
    <section ref={ref} className="mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="mb-12 space-y-4"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">Live demo</p>
        <h2 className="text-4xl font-display text-primary sm:text-5xl">Curriculum preview</h2>
        <p className="max-w-2xl text-lg text-primary/80">
          Waypoint works across any subject. This preview uses the same visual language as the result page so the experience feels consistent.
        </p>
      </motion.div>

      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((item, index) => (
              <TopicPill
                key={item.key}
                label={item.label}
                active={item.key === selectedTopic}
                delay={0.12 + index * 0.05}
                onClick={() => setSelectedTopic(item.key)}
              />
            ))}
          </div>
          <div className="hidden gap-2 sm:flex">
            <motion.button
              onClick={() => setSelectedTopic((current) => TOPICS[(TOPICS.findIndex((item) => item.key === current) - 1 + TOPICS.length) % TOPICS.length].key)}
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-subtle bg-[color:var(--surface)] transition-colors hover:bg-[color:var(--card)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white">‹</span>
            </motion.button>
            <motion.button
              onClick={() => setSelectedTopic((current) => TOPICS[(TOPICS.findIndex((item) => item.key === current) + 1) % TOPICS.length].key)}
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-subtle bg-[color:var(--surface)] transition-colors hover:bg-[color:var(--card)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white">›</span>
            </motion.button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <DemoCard topic={topic} nodes={demoNodes} links={demoLinks} visible={inView} />
        </motion.div>
      </div>
    </section>
  );
}
