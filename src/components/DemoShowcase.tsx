"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProgressSidebar from "./ProgressSidebar";
import CurriculumCompletionHero from "./CurriculumCompletionHero";
import WeekNav from "./WeekNav";
import WeekSection, { weekDayKey } from "./WeekSection";
import type { CurriculumProgress, Day, Week } from "@/types/curriculum";

// Multiple curriculum examples showing diversity of subjects
const curriculumExamples = [
  {
    id: "react",
    topic: "React Fundamentals",
    level: "Beginner",
    durationDays: 5,
    hoursPerDay: 1.5,
    weeks: [
      {
        week: 1,
        theme: "Components & Hooks",
        days: [
          {
            day: 1,
            concept: "React Basics",
            video: {
              youtube_id: "TtPXvEcE11E",
              title: "React Tutorial Full Course - Beginner to Pro",
              channel: "SuperSimpleDev",
              duration_seconds: 41400,
              score: 0.65,
              why_this_video: "A complete beginner-friendly walkthrough with strong pacing and clear examples.",
              transcript_available: true,
            },
          },
          {
            day: 2,
            concept: "JSX & Components",
            video: {
              youtube_id: "jjqIEkl33h8",
              title: "React Components Deep Dive",
              channel: "Traversy Media",
              duration_seconds: 32400,
              score: 0.72,
              why_this_video: "Builds the component model with enough depth to move beyond copy-paste tutorials.",
              transcript_available: true,
            },
          },
          {
            day: 3,
            concept: "Hooks (useState, useEffect)",
            video: {
              youtube_id: "O6P86IyJjwk",
              title: "React Hooks Tutorial",
              channel: "The Net Ninja",
              duration_seconds: 28800,
              score: 0.78,
              why_this_video: "Strong coverage of the hooks that matter most for day-to-day React work.",
              transcript_available: true,
            },
          },
        ],
      },
    ],
    completedDays: 1,
    totalDays: 3,
  },
  {
    id: "python",
    topic: "Python for Data Science",
    level: "Intermediate",
    durationDays: 5,
    hoursPerDay: 2,
    weeks: [
      {
        week: 1,
        theme: "NumPy & Pandas",
        days: [
          {
            day: 1,
            concept: "NumPy Arrays",
            video: {
              youtube_id: "gCCaSSbVplI",
              title: "NumPy Tutorial for Beginners",
              channel: "Data School",
              duration_seconds: 39600,
              score: 0.73,
              why_this_video: "Clear intro to numerical arrays with practical examples.",
              transcript_available: true,
            },
          },
          {
            day: 2,
            concept: "Pandas DataFrames",
            video: {
              youtube_id: "vmEHCJsSU2M",
              title: "Pandas Tutorial - Data Manipulation",
              channel: "Corey Schafer",
              duration_seconds: 45000,
              score: 0.79,
              why_this_video: "Comprehensive guide to working with structured data.",
              transcript_available: true,
            },
          },
          {
            day: 3,
            concept: "Data Visualization",
            video: {
              youtube_id: "kJQ3Kpp6gV8",
              title: "Matplotlib & Seaborn Visualization",
              channel: "StatQuest",
              duration_seconds: 36000,
              score: 0.75,
              why_this_video: "Beautiful data visualization techniques explained clearly.",
              transcript_available: true,
            },
          },
        ],
      },
    ],
    completedDays: 0,
    totalDays: 3,
  },
  {
    id: "design",
    topic: "Web Design Fundamentals",
    level: "Beginner",
    durationDays: 4,
    hoursPerDay: 1,
    weeks: [
      {
        week: 1,
        theme: "Design Principles",
        days: [
          {
            day: 1,
            concept: "Design Theory",
            video: {
              youtube_id: "gC-gHOcN-vU",
              title: "Graphic Design Principles",
              channel: "Futur",
              duration_seconds: 34200,
              score: 0.68,
              why_this_video: "Foundational design principles that apply everywhere.",
              transcript_available: true,
            },
          },
          {
            day: 2,
            concept: "Typography",
            video: {
              youtube_id: "sByzHoiYFX0",
              title: "Typography Masterclass",
              channel: "Design Observer",
              duration_seconds: 30600,
              score: 0.71,
              why_this_video: "Type selection and hierarchy for compelling layouts.",
              transcript_available: true,
            },
          },
          {
            day: 3,
            concept: "Color Theory",
            video: {
              youtube_id: "Qj1FK8-QwGc",
              title: "Color Theory for Designers",
              channel: "The Futur",
              duration_seconds: 27000,
              score: 0.76,
              why_this_video: "Using color effectively to guide user attention.",
              transcript_available: true,
            },
          },
        ],
      },
    ],
    completedDays: 2,
    totalDays: 3,
  },
  {
    id: "cooking",
    topic: "Home Cooking Basics",
    level: "Beginner",
    durationDays: 3,
    hoursPerDay: 1,
    weeks: [
      {
        week: 1,
        theme: "Knife Skills & Basics",
        days: [
          {
            day: 1,
            concept: "Knife Skills",
            video: {
              youtube_id: "dQw4w9WgXcQ",
              title: "Essential Knife Skills for Home Cooks",
              channel: "ChefSimple",
              duration_seconds: 1800,
              score: 0.82,
              why_this_video: "Quick, practical knife drills to speed up prep and reduce waste.",
              transcript_available: true,
            },
          },
          {
            day: 2,
            concept: "Stocks & Sauces",
            video: {
              youtube_id: "9bZkp7q19f0",
              title: "Basic Stocks and Quick Sauces",
              channel: "KitchenLab",
              duration_seconds: 2400,
              score: 0.77,
              why_this_video: "Foundational liquid building blocks that improve every recipe.",
              transcript_available: true,
            },
          },
          {
            day: 3,
            concept: "Simple Weeknight Meals",
            video: {
              youtube_id: "3JZ_D3ELwOQ",
              title: "Quick Weeknight Dinners",
              channel: "HomeCooked",
              duration_seconds: 2100,
              score: 0.74,
              why_this_video: "Recipes that balance speed, flavor, and minimal cleanup.",
              transcript_available: true,
            },
          },
        ],
      },
    ],
    completedDays: 1,
    totalDays: 3,
  },
  {
    id: "guitar",
    topic: "Guitar for Beginners",
    level: "Beginner",
    durationDays: 7,
    hoursPerDay: 0.75,
    weeks: [
      {
        week: 1,
        theme: "Chords & Rhythm",
        days: [
          {
            day: 1,
            concept: "Open Chords",
            video: {
              youtube_id: "V-_O7nl0Ii0",
              title: "Learn Open Chords Fast",
              channel: "FenderPlay",
              duration_seconds: 1500,
              score: 0.8,
              why_this_video: "Straightforward chord shapes and common transitions.",
              transcript_available: true,
            },
          },
          {
            day: 2,
            concept: "Strumming Patterns",
            video: {
              youtube_id: "eVTXPUF4Oz4",
              title: "Basic Strumming Patterns",
              channel: "GuitarLessons",
              duration_seconds: 1800,
              score: 0.76,
              why_this_video: "Practical rhythm patterns to play along with songs.",
              transcript_available: true,
            },
          },
          {
            day: 3,
            concept: "Simple Song",
            video: {
              youtube_id: "kXYiU_JCYtU",
              title: "Play Your First Song",
              channel: "AcousticSchool",
              duration_seconds: 2100,
              score: 0.79,
              why_this_video: "Put chords and strumming together into a real song.",
              transcript_available: true,
            },
          },
        ],
      },
    ],
    completedDays: 0,
    totalDays: 3,
  },
  {
    id: "photography",
    topic: "Photography Basics",
    level: "Beginner",
    durationDays: 4,
    hoursPerDay: 1,
    weeks: [
      {
        week: 1,
        theme: "Exposure & Composition",
        days: [
          {
            day: 1,
            concept: "Exposure Triangle",
            video: {
              youtube_id: "fJ9rUzIMcZQ",
              title: "Understanding Exposure",
              channel: "PhotoGuy",
              duration_seconds: 2700,
              score: 0.75,
              why_this_video: "A clear visual explanation of aperture, shutter, and ISO.",
              transcript_available: true,
            },
          },
          {
            day: 2,
            concept: "Composition Rules",
            video: {
              youtube_id: "60ItHLz5WEA",
              title: "Composition Techniques",
              channel: "The Photo Academy",
              duration_seconds: 2400,
              score: 0.78,
              why_this_video: "Practical composition tips to improve every shot.",
              transcript_available: true,
            },
          },
          {
            day: 3,
            concept: "Lighting",
            video: {
              youtube_id: "RgKAFK5djSk",
              title: "Intro to Lighting",
              channel: "LightCraft",
              duration_seconds: 3000,
              score: 0.74,
              why_this_video: "How to see and use natural and artificial light.",
              transcript_available: true,
            },
          },
        ],
      },
    ],
    completedDays: 3,
    totalDays: 3,
  },
  {
    id: "gardening",
    topic: "Urban Gardening",
    level: "Beginner",
    durationDays: 4,
    hoursPerDay: 0.75,
    weeks: [
      {
        week: 1,
        theme: "Container Gardening",
        days: [
          {
            day: 1,
            concept: "Soil & Pots",
            video: {
              youtube_id: "2Vv-BfVoq4g",
              title: "Choosing Soil and Containers",
              channel: "GardenSchool",
              duration_seconds: 1500,
              score: 0.7,
              why_this_video: "What to plant where and how to set up containers for success.",
              transcript_available: true,
            },
          },
          {
            day: 2,
            concept: "Watering & Care",
            video: {
              youtube_id: "hTWKbfoikeg",
              title: "Watering Tips for Healthy Plants",
              channel: "UrbanGrow",
              duration_seconds: 1200,
              score: 0.72,
              why_this_video: "Simple care routines for busy people.",
              transcript_available: true,
            },
          },
          {
            day: 3,
            concept: "Seasonal Planting",
            video: {
              youtube_id: "eY52Zsg-KVI",
              title: "What to Plant Each Season",
              channel: "PlantsMadeEasy",
              duration_seconds: 1800,
              score: 0.74,
              why_this_video: "Practical planting calendars and quick wins.",
              transcript_available: true,
            },
          },
        ],
      },
    ],
    completedDays: 3,
    totalDays: 3,
  },
  {
    id: "pottery",
    topic: "Intro to Pottery",
    level: "Beginner",
    durationDays: 5,
    hoursPerDay: 1,
    weeks: [
      {
        week: 1,
        theme: "Handbuilding Basics",
        days: [
          {
            day: 1,
            concept: "Clay & Tools",
            video: {
              youtube_id: "RgKAFK5djSk",
              title: "Getting Started with Clay",
              channel: "ClayWorks",
              duration_seconds: 1600,
              score: 0.69,
              why_this_video: "How to pick clay and basic shaping tools.",
              transcript_available: true,
            },
          },
          {
            day: 2,
            concept: "Pinch & Coil",
            video: {
              youtube_id: "fJ9rUzIMcZQ",
              title: "Pinch Pot and Coil Techniques",
              channel: "HandmadeStudio",
              duration_seconds: 2100,
              score: 0.72,
              why_this_video: "Start making useful objects with handbuilding.",
              transcript_available: true,
            },
          },
        ],
      },
    ],
    completedDays: 0,
    totalDays: 2,
  },
  {
    id: "calligraphy",
    topic: "Modern Calligraphy",
    level: "Beginner",
    durationDays: 3,
    hoursPerDay: 0.5,
    weeks: [
      {
        week: 1,
        theme: "Tools & Strokes",
        days: [
          {
            day: 1,
            concept: "Pens & Ink",
            video: {
              youtube_id: "kXYiU_JCYtU",
              title: "Choosing Pens and Inks",
              channel: "LetteringLab",
              duration_seconds: 900,
              score: 0.7,
              why_this_video: "Materials that make practice more enjoyable.",
              transcript_available: true,
            },
          },
          {
            day: 2,
            concept: "Basic Strokes",
            video: {
              youtube_id: "V-_O7nl0Ii0",
              title: "Practice Basic Strokes",
              channel: "CalligraphyCoach",
              duration_seconds: 1200,
              score: 0.75,
              why_this_video: "Short, focused drills to accelerate progress.",
              transcript_available: true,
            },
          },
        ],
      },
    ],
    completedDays: 0,
    totalDays: 2,
  },
  {
    id: "birdwatching",
    topic: "Birdwatching Basics",
    level: "Beginner",
    durationDays: 2,
    hoursPerDay: 1,
    weeks: [
      {
        week: 1,
        theme: "Identifying Birds",
        days: [
          {
            day: 1,
            concept: "Binoculars & Field Marks",
            video: {
              youtube_id: "9bZkp7q19f0",
              title: "Beginner Bird ID Tips",
              channel: "NatureWatch",
              duration_seconds: 1500,
              score: 0.71,
              why_this_video: "Field tips for spotting and identifying common species.",
              transcript_available: true,
            },
          },
        ],
      },
    ],
    completedDays: 0,
    totalDays: 1,
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DemoShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = curriculumExamples[activeIndex];

  const progress: CurriculumProgress = {
    completedDays: current.completedDays,
    totalDays: current.totalDays,
    currentStreak: current.completedDays > 0 ? 1 : 0,
    remainingHours: (current.totalDays - current.completedDays) * current.hoursPerDay,
    percent: Math.round((current.completedDays / current.totalDays) * 100),
  };

  const demoCompletion = Object.fromEntries(
    current.weeks.flatMap((week) =>
      week.days.slice(0, current.completedDays).map((day) => [weekDayKey(week.week, day as Day), true]),
    ),
  );

  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="mb-12 space-y-4"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">Live demo</p>
        <h2 className="text-4xl font-display text-primary sm:text-5xl">See what you'll get</h2>
        <p className="max-w-2xl text-lg text-primary/80">
          Waypoint works across any subject. Here are real curricula generated for different topics—from React to data science to design.
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Carousel controls */}
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex flex-wrap gap-2">
            {curriculumExamples.map((example, index) => (
              <motion.button
                key={example.id}
                onClick={() => setActiveIndex(index)}
                className={`focus-ring rounded-full border px-2 py-1 font-mono text-[8px] uppercase tracking-[0.28em] transition-all sm:px-3 sm:py-1.5 sm:text-[10px] ${
                  index === activeIndex
                    ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-black"
                    : "border-subtle bg-[color:var(--surface)] text-primary hover:border-[color:var(--accent)]"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {example.topic.split(" ")[0]}
              </motion.button>
            ))}
          </div>
          <div className="hidden gap-2 sm:flex">
            <motion.button
              onClick={() => setActiveIndex((i) => (i - 1 + curriculumExamples.length) % curriculumExamples.length)}
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-subtle bg-[color:var(--surface)] transition-colors hover:bg-[color:var(--card)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>
            <motion.button
              onClick={() => setActiveIndex((i) => (i + 1) % curriculumExamples.length)}
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-subtle bg-[color:var(--surface)] transition-colors hover:bg-[color:var(--card)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

        {/* Demo content */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-[32px] border border-subtle bg-[color:var(--surface)] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-6"
        >
          <div className="space-y-6">
            <CurriculumCompletionHero progress={progress} topic={current.topic} />

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="min-w-0 space-y-6">
              <div className="rounded-[28px] border border-subtle bg-[color:var(--card)] p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="space-y-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">Curriculum</p>
                    <h3 className="text-3xl font-display text-primary sm:text-4xl">{current.topic}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                    <span className="rounded-full border border-subtle bg-[color:var(--surface)] px-3 py-2 text-primary capitalize">
                      {current.level}
                    </span>
                    <span className="rounded-full border border-subtle bg-[color:var(--surface)] px-3 py-2 text-primary">
                      {current.durationDays} days
                    </span>
                    <span className="rounded-full border border-subtle bg-[color:var(--surface)] px-3 py-2 text-primary">
                      {current.hoursPerDay}h/day
                    </span>
                  </div>
                </div>
              </div>

              <WeekNav weeks={current.weeks} activeWeek={1} onSelectWeek={() => undefined} />

              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }} initial="hidden" animate="visible">
                <div className="space-y-8">
                  {current.weeks.map((week) => (
                    <motion.div key={week.week} variants={itemVariants}>
                      <WeekSection
                        curriculumId={current.id}
                        week={week}
                        sectionRef={() => undefined}
                        completionState={demoCompletion}
                        onToggleComplete={() => undefined}
                        onPlayVideo={() => undefined}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <ProgressSidebar progress={progress} compact className="lg:sticky lg:top-[160px] lg:self-start" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
