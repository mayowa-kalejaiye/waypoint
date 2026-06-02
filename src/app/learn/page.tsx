"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import LearnInput from "@/components/LearnInput";
import CanvasLoadingScreen from "@/components/CanvasLoadingScreen";
import CanvasResults from "@/components/CanvasResults";
import { getCurriculum } from "@/lib/api";
import type { Curriculum } from "@/types/curriculum";

type NodeItem = {
  id: string;
  title: string;
  youtube_id?: string;
  url?: string;
  duration_seconds?: number;
  channel?: string;
  score?: number;
  thumbnail_url?: string;
  x: number;
  y: number;
};

function readStoredCurriculum(curriculumId?: string) {
  if (typeof window === "undefined" || !curriculumId) {
    return null;
  }

  const keys = [`waypoint:curriculum:${curriculumId}`, "waypoint:curriculum:last"];
  for (const key of keys) {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      continue;
    }

    try {
      const parsed = JSON.parse(raw) as Curriculum;
      if (!curriculumId || parsed.curriculum_id === curriculumId) {
        return parsed;
      }
    } catch {
      window.localStorage.removeItem(key);
    }
  }

  return null;
}

function curriculumToNodes(curriculum: Curriculum): NodeItem[] {
  return curriculum.weeks.flatMap((week, weekIndex) =>
    week.days.map((day, dayIndex) => ({
      id: `${week.week}-${day.day}`,
      title: day.video.title,
      youtube_id: day.video.youtube_id,
      url: day.video.url,
        duration_seconds: day.video.duration_seconds,
        channel: day.video.channel,
        score: day.video.score,
        thumbnail_url: day.video.youtube_id ? `https://img.youtube.com/vi/${day.video.youtube_id}/hqdefault.jpg` : undefined,
        x: 120 + dayIndex * 240,
        y: 100 + weekIndex * 180,
    })),
  );
}

export default function LearnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const curriculumId = searchParams.get("curriculum_id") || undefined;
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [manualNodes, setManualNodes] = useState<NodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const redirectingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCurriculum() {
      const stored = readStoredCurriculum(curriculumId);
      if (stored) {
        if (!cancelled) {
          setCurriculum(stored);
          setLoading(false);
        }
        return;
      }

      if (!curriculumId) {
        if (!cancelled) {
          setLoading(false);
        }
        return;
      }

      try {
        const response = await getCurriculum(curriculumId);
        if (!cancelled) {
          setCurriculum(response);
        }
      } catch {
        if (!cancelled) {
          setCurriculum(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCurriculum();
    return () => {
      cancelled = true;
    };
  }, [curriculumId]);

  const nodes = useMemo(() => (curriculum ? curriculumToNodes(curriculum) : []), [curriculum]);
  const fallbackNodes = useMemo(() => manualNodes, [manualNodes]);

  useEffect(() => {
    if (!curriculumId || !curriculum || loading) return;
    if (!Array.isArray(curriculum.weeks) || curriculum.weeks.length === 0) return;
    if (redirectingRef.current) return;

    let cancelled = false;
    redirectingRef.current = true;

    async function createCanvasAndRedirect() {
      try {
        const response = await fetch("/api/v1/canvas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nodes,
            links: [],
            meta: { created_at: new Date().toISOString(), source: "learn", curriculum_id: curriculumId },
            session_id: (window as typeof window & { __learning_session_id?: string }).__learning_session_id || "anon",
            title: curriculum?.topic || "Learning canvas",          
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create canvas");
        }

        const payload = (await response.json()) as { id?: string };
        if (!cancelled && payload.id) {
          router.replace(`/canvas/${payload.id}`);
        }
      } catch {
        redirectingRef.current = false;
      }
    }

    void createCanvasAndRedirect();

    return () => {
      cancelled = true;
    };
  }, [curriculum, curriculumId, loading, nodes, router]);

  if (loading) {
    return <CanvasLoadingScreen visible={true} title="Loading your results" statusMessage="Please wait while we build the canvas" />;
  }

  if (curriculum) {
    const isCanvasReady = Array.isArray(curriculum.weeks) && curriculum.weeks.length > 0;
    if (isCanvasReady) {
      return <CanvasLoadingScreen visible={true} title="Loading your results" statusMessage="Please wait while we build the canvas" />;
    }
    return (
      <div className="min-h-screen bg-[#090909] text-primary">
        <CanvasResults nodes={nodes} storageKey={curriculumId ? `learn:${curriculumId}` : "learn"} ready={isCanvasReady} title={curriculum?.topic || "Learning canvas"} curriculumId={curriculumId} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090909] px-4 py-8 text-primary sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-8">
        <div className="max-w-3xl space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">Canvas result</p>
          <h1 className="text-[clamp(2.5rem,6vw,4.8rem)] leading-[0.95] font-display text-primary">Your learning canvas</h1>
          <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
            This is the result page now: a sequenced canvas built from real ranked videos, ready to move, save, and share.
          </p>
        </div>

        {!curriculum && (
          <div className="space-y-6">
            <div className="max-w-3xl">
              <LearnInput
                onResults={(results: any[]) =>
                  setManualNodes(
                    results.map((item: any, index: number) => ({
                      id: item.id || item.youtube_id || `node-${index}`,
                      title: item.title || item.name || item.video_title || "Untitled",
                      youtube_id: item.youtube_id || item.youtubeId,
                      url: item.url || item.link || undefined,
                      duration_seconds: item.duration_seconds || item.durationSeconds,
                      channel: item.channel || item.creator || undefined,
                      score: typeof item.score === "number" ? item.score : undefined,
                      thumbnail_url: item.thumbnail_url || (item.youtube_id || item.youtubeId ? `https://img.youtube.com/vi/${item.youtube_id || item.youtubeId}/hqdefault.jpg` : undefined),
                      x: 120 + index * 180,
                      y: 100 + Math.sin(index * 0.9) * 36 + (index % 2 === 0 ? -12 : 18),
                    })),
                  )
                }
              />
            </div>
            {fallbackNodes.length ? <CanvasResults nodes={fallbackNodes} storageKey="learn:manual" ready={fallbackNodes.length > 0} title="Custom learning path" /> : null}
          </div>
        )}
      </div>
    </div>
  );
}
