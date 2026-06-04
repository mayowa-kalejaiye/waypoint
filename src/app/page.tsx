"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, CheckCircle2, Clock3, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DemoSection from "@/components/DemoSection";
import HowItWorks from "@/components/HowItWorks";
import GeneratingScreen from "@/components/GeneratingScreen";
import LaunchWaitlistForm from "@/components/LaunchWaitlistForm";
import SiteFooter from "@/components/SiteFooter";
import WaypointInput from "@/components/WaypointInput";
import { generateCurriculum, isCurriculumFinalized } from "@/lib/api";
import { getOrCreateLearningIdentity } from "@/lib/identity";
import { trackLaunchEvent } from "@/lib/launch";
import { getFriendlyErrorMessage } from "@/lib/userMessages";
import type { Curriculum, GenerateCurriculumRequest } from "@/types/curriculum";

const HERO_WORDS = ["Tell me", "what", "you", "want", "to", "learn."];

const PHASE_STEPS = [
  { label: "Goal in", detail: "Understanding your goal" },
  { label: "Path mapped", detail: "Mapping dependencies" },
  { label: "Keep going", detail: "Finding best videos" },
];

const QUICK_STARTS = [
  "Build a portfolio website with React",
  "Learn data structures in Python",
  "Plan a content strategy for a product launch",
];

const PRODUCT_SIGNALS = [
  { label: "Real YouTube videos", icon: CheckCircle2 },
  { label: "Dependency-aware sequencing", icon: Sparkles },
  { label: "Paced to your level", icon: Clock3 },
] as const;

function curriculumToCanvasNodes(curriculum: Curriculum) {
  return curriculum.weeks.flatMap((week, weekIndex) =>
    week.days.map((day, dayIndex) => ({
      id: `${week.week}-${day.day}`,
      concept: day.concept,
      title: day.video.title,
      youtube_id: day.video.youtube_id,
      url: day.video.url,
      duration_seconds: day.video.duration_seconds,
      channel: day.video.channel,
      score: day.video.score,
      thumbnail_url: day.video.youtube_id ? `https://img.youtube.com/vi/${day.video.youtube_id}/hqdefault.jpg` : undefined,
      completed: false,
      x: 120 + dayIndex * 240,
      y: 100 + weekIndex * 180,
    })),
  );
}

function synthesizeCanvasLinks(curriculum: Curriculum) {
  const nodes = curriculum.weeks.flatMap((week) => week.days.map((day) => ({ id: `${week.week}-${day.day}`, concept: day.concept })));
  const conceptToId = new Map(nodes.map((n) => [String(n.concept).trim().toLowerCase(), n.id]));
  const progression = (curriculum as any).progression_concepts || [];
  const links: Array<{ id: string; from: string; to: string }> = [];

  for (const item of progression) {
    const toName = String(item.name || item.name).trim().toLowerCase();
    const toId = conceptToId.get(toName);
    if (!toId) continue;
    const prereqs: string[] = Array.isArray(item.prerequisites) ? item.prerequisites : item.depends_on || [];
    for (const p of prereqs) {
      const fromName = String(p).trim().toLowerCase();
      const fromId = conceptToId.get(fromName);
      if (!fromId) continue;
      links.push({ id: `link-${fromId}-${toId}`, from: fromId, to: toId });
    }
  }

  return links;
}

type LearningIdentity = {
  sessionId: string;
  username: string;
};

type ToastState = {
  message: string;
  tone: "warning" | "success";
};

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [identity, setIdentity] = useState<LearningIdentity>({ sessionId: "", username: "" });
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    setIdentity(getOrCreateLearningIdentity());
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  useEffect(() => {
    void trackLaunchEvent("homepage_viewed", { phase: "phase_1_launch" });
  }, []);

  const showToast = (message: string, tone: ToastState["tone"] = "warning") => {
    setToast({ message, tone });
  };

  const handleGenerate = async (payload: GenerateCurriculumRequest) => {
    setError(null);
    setLoading(true);
    setProgress(5);
    void trackLaunchEvent("curriculum_generate_started", {
      goal_length: payload.goal.trim().length,
      level: payload.level,
      hours_per_day: payload.hours_per_day,
    });

    const requestPayload = { ...payload, session_id: identity.sessionId };
    sessionStorage.setItem("waypoint:request:last", JSON.stringify(requestPayload));

    const pulse = window.setInterval(() => {
      setProgress((current) => (current >= 88 ? current : Math.min(88, current + 2)));
    }, 600);

    try {
      const response = await generateCurriculum(requestPayload);

      if (response.status === "failed") {
        throw new Error(response.error || "We couldn't generate this curriculum. Please try again.");
      }

      if (response.status === "completed" && response.curriculum_id) {
        const curriculum: Curriculum = {
          curriculum_id: response.curriculum_id,
          topic: response.topic || payload.goal,
          duration_days: response.duration_days || 0,
          level: payload.level,
          hours_per_day: payload.hours_per_day,
          description: "",
          warning: response.warning || null,
          weeks: response.weeks || [],
          generator_version: (response as any).generator_version || undefined,
          domain: (response as any).domain || undefined,
          diversity_warnings: (response as any).diversity_warnings || undefined,
          requires_review: (response as any).requires_review || undefined,
          projects: (response as any).projects || undefined,
          adaptive_rules: (response as any).adaptive_rules || undefined,
          progression_concepts: (response as any).progression_concepts || (response as any).llm_plan?.dependency_graph?.nodes || [],
        };

        localStorage.setItem(`waypoint:curriculum:${curriculum.curriculum_id}`, JSON.stringify(curriculum));
        localStorage.setItem("waypoint:curriculum:last", JSON.stringify(curriculum));
        setProgress(100);
        void trackLaunchEvent("curriculum_generate_completed", {
          curriculum_id: curriculum.curriculum_id,
          topic: curriculum.topic,
          level: curriculum.level,
        });

        if (response.warning) {
          showToast(response.warning, "warning");
        }

        if (!isCurriculumFinalized(curriculum)) {
          router.push(`/canvas/preview?job_id=${response.job_id}`);
          return;
        }

        if ((response.remaining_requests ?? 99) < 3 && typeof response.remaining_requests === "number") {
          showToast(`You have ${response.remaining_requests} free generations left this hour. Upgrade to Pro for unlimited.`, "warning");
        }
        try {
          const nodes = curriculumToCanvasNodes(curriculum);
          const links = synthesizeCanvasLinks(curriculum);

          const canvasResponse = await fetch(`/api/v1/canvas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nodes,
              links,
              meta: { created_at: new Date().toISOString(), source: "homepage", curriculum_id: curriculum.curriculum_id },
              session_id: identity.sessionId,
              title: curriculum.topic || payload.goal,
            }),
          });

          if (canvasResponse.ok) {
            const canvasPayload = (await canvasResponse.json()) as { id?: string };
            if (canvasPayload.id) {
              router.push(`/canvas/${canvasPayload.id}`);
              return;
            }
          }
        } catch (canvasError) {
          console.warn("Failed to create canvas from curriculum", canvasError);
        }

        router.push(`/canvas/preview?curriculum_id=${curriculum.curriculum_id}`);
        return;
      }

      if (response.job_id) {
        setProgress(25);
        void trackLaunchEvent("curriculum_generate_queued", { job_id: response.job_id, level: payload.level });

        if ((response.remaining_requests ?? 99) < 3 && typeof response.remaining_requests === "number") {
          showToast(`You have ${response.remaining_requests} free generations left this hour. Upgrade to Pro for unlimited.`, "warning");
        }
        router.push(`/canvas/preview?job_id=${response.job_id}`);
        return;
      }

      throw new Error("Missing curriculum job id");
    } catch (generateError) {
      console.error("Failed to generate curriculum:", generateError);
      void trackLaunchEvent("curriculum_generate_failed", {
        level: payload.level,
        hours_per_day: payload.hours_per_day,
      });
      setError(getFriendlyErrorMessage(generateError));
    } finally {
      window.clearInterval(pulse);
      setLoading(false);
    }
  };

  return (
    <main id="top" className="relative min-h-screen overflow-hidden bg-app text-primary">
      <div className="pointer-events-none absolute inset-0">
        <div className="noise-layer absolute inset-0" />
        <motion.div
          animate={{ x: [0, 42, -24, 0], y: [0, -18, 14, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-8rem] top-[-8rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(200,254,2,0.12),transparent_65%)] blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -28, 22, 0], y: [0, 16, -20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-10rem] top-[18rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(200,254,2,0.08),transparent_68%)] blur-3xl"
        />
      </div>

      <section className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="h-2.5 w-2.5 rounded-full bg-[color:var(--accent)] shadow-[0_0_24px_rgba(200,254,2,0.5)]"
            />
            <span className="font-display text-xl text-primary">Waypoint</span>
          </div>
          <div className="hidden font-mono text-[10px] uppercase tracking-[0.35em] text-muted sm:block">Phase 1 launch</div>
        </header>

        <div className="mt-20 flex justify-center xl:mt-24">
          <div className="min-w-0 max-w-5xl space-y-8 text-center">
            <div className="space-y-5">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[color:rgba(200,254,2,0.18)] bg-[color:rgba(200,254,2,0.06)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)] shadow-[0_0_18px_rgba(200,254,2,0.55)]" />
                Phase 1 launch
              </div>

              <div className="flex flex-wrap justify-center gap-2 text-[clamp(2.4rem,9.6vw,6.8rem)] font-display leading-[0.9] text-primary sm:gap-3 sm:text-[clamp(3rem,7.6vw,7.2rem)]">
                {HERO_WORDS.map((word, index) => (
                  <motion.span
                    key={`${word}-${index}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: index * 0.03 }}
                    className={index % 2 === 1 ? "text-accent" : ""}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>

              <p className="mx-auto max-w-3xl text-base leading-7 text-muted sm:text-lg">
                Tell Waypoint the outcome, and it gives you the best sequenced video playlist in about 5 minutes.
                Less noise, better order, and a canvas you can keep moving in.
              </p>

              <p className="mx-auto max-w-2xl font-mono text-[10px] uppercase tracking-[0.35em] text-muted sm:text-[11px]">
                The internet gives you content. Waypoint gives you a path.
              </p>
            </div>

            <div className="mx-auto max-w-4xl rounded-[30px] border border-[color:rgba(200,254,2,0.16)] bg-[linear-gradient(180deg,rgba(17,17,17,0.96),rgba(15,15,15,0.9))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.3)] sm:p-5">
              <div className="mb-4 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">Start with one goal</p>
              </div>
              <WaypointInput loading={loading} compact={loading} onGenerate={handleGenerate} />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {PRODUCT_SIGNALS.map((signal, index) => {
                const Icon = signal.icon;

                return (
                  <motion.div
                    key={signal.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
                    className="rounded-[24px] border border-subtle bg-[color:var(--surface)] p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl border border-[color:rgba(200,254,2,0.16)] bg-[color:rgba(200,254,2,0.08)] text-accent">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-display text-primary">{signal.label}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {error ? (
              <p className="max-w-2xl rounded-2xl border border-[color:rgba(255,255,255,0.08)] bg-[color:rgba(255,255,255,0.03)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-[color:#ff8080]">
                {error}
              </p>
            ) : null}

            <div className="hidden pt-2 lg:block">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="flex items-center justify-center gap-3 text-[10px] font-mono uppercase tracking-[0.4em] text-muted"
              >
                <span>Scroll</span>
                <ArrowDown className="h-4 w-4 animate-bounce text-accent" />
              </motion.div>
            </div>
          </div>
        </div>

        <section id="demo" className="scroll-mt-24">
          <DemoSection />
        </section>
        <section className="scroll-mt-24">
          <LaunchWaitlistForm />
        </section>
        <section id="how-it-works" className="scroll-mt-24">
          <HowItWorks />
        </section>
      </section>

      <SiteFooter />

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className={`fixed bottom-5 right-5 z-[90] max-w-sm rounded-[22px] border px-4 py-3 shadow-[0_24px_70px_rgba(0,0,0,0.32)] ${toast.tone === "warning" ? "border-[color:rgba(255,177,77,0.35)] bg-[color:rgba(255,177,77,0.12)] text-[color:#ffcf8f]" : "border-[color:rgba(200,254,2,0.22)] bg-[color:rgba(200,254,2,0.12)] text-primary"}`}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.35em]">Waypoint</p>
            <p className="mt-2 text-sm leading-6">{toast.message}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {loading ? <GeneratingScreen visible={loading} progress={progress} /> : null}
      </AnimatePresence>
    </main>
  );
}
