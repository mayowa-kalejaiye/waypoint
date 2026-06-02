"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import CanvasLoadingScreen from "@/components/CanvasLoadingScreen";
import CanvasResultPage from "@/components/CanvasResults";
import { waitForCurriculum } from "@/lib/api";
import type { Curriculum } from "@/types/curriculum";   

function curriculumToCanvasNodes(curriculum: Curriculum | null | undefined) {
  if (!curriculum?.weeks) return [];

  return curriculum.weeks.flatMap((week, weekIndex) =>
    week.days.map((day, dayIndex) => ({
      id: `${week.week}-${day.day}`,
      title: day.video.title,
      youtube_id: day.video.youtube_id,
      url: day.video.url,
      duration_seconds: day.video.duration_seconds,
      channel: day.video.channel,
      score: day.video.score,
      thumbnail_url: day.video.youtube_id 
        ? `https://img.youtube.com/vi/${day.video.youtube_id}/hqdefault.jpg` 
        : undefined,
      completed: false,
      x: 120 + dayIndex * 240,
      y: 100 + weekIndex * 180,
    }))
  );
}

function synthesizeCanvasLinks(curriculum: Curriculum | null | undefined) {
  if (!curriculum?.weeks) return [];

  const nodes = curriculumToCanvasNodes(curriculum);
  const links = [];

  for (let i = 0; i < nodes.length - 1; i++) {
    links.push({
      id: `link-${nodes[i].id}-${nodes[i + 1].id}`,
      from: nodes[i].id,
      to: nodes[i + 1].id,
    });
  }

  return links;
}

export default function CanvasPreviewPage() {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [jobStatus, setJobStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const searchParams = useSearchParams();

  const curriculumCacheKey = (curriculumId?: string) => 
    curriculumId ? `waypoint:curriculum:${curriculumId}` : null;

  useEffect(() => {
    let cancelled = false;

    async function loadPreview() {
      try {
        const curriculumId = searchParams.get("curriculum_id");
        const jobId = searchParams.get("job_id");

        if (curriculumId) {
          const cacheKey = curriculumCacheKey(curriculumId);
          if (cacheKey) {
            const cached = window.localStorage.getItem(cacheKey);
            if (cached) {
              const parsed = JSON.parse(cached) as Curriculum;
              if (!cancelled && parsed?.curriculum_id === curriculumId) {
                setLoadingProgress(100);
                setCurriculum(parsed);
                return;
              }
            }
          }

          setLoadingProgress(25);
          const response = await fetch(`/api/v1/curriculum/${curriculumId}`);
          if (response.ok) {
            const data = (await response.json()) as Curriculum;
            if (!cancelled) {
              setLoadingProgress(100);
              setCurriculum(data);
              if (cacheKey) {
                try {
                  window.localStorage.setItem(cacheKey, JSON.stringify(data));
                } catch {}
              }
            }
          }
          return;
        }

        if (jobId) {
          setJobStatus("loading");
          setLoadingProgress(5);
          const data = await waitForCurriculum(jobId, (progress) => {
            if (!cancelled) setLoadingProgress(progress);
          });

          if (!cancelled) {
            setLoadingProgress(100);
            setCurriculum(data as Curriculum);
            setJobStatus("ready");

            try {
              const cacheKey = curriculumCacheKey(data.curriculum_id || undefined);
              if (cacheKey) {
                window.localStorage.setItem(cacheKey, JSON.stringify(data));
              }
              window.localStorage.setItem("waypoint:curriculum:last", JSON.stringify(data));
            } catch {}
          }
          return;
        }

        // Fallback to last curriculum
        const stored = window.localStorage.getItem("waypoint:curriculum:last");
        if (stored) {
          if (!cancelled) {
            setCurriculum(JSON.parse(stored) as Curriculum);
          }
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setJobStatus("error");
        }
      }
    }

    void loadPreview();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const nodes = useMemo(() => curriculumToCanvasNodes(curriculum), [curriculum]);
  const links = useMemo(() => synthesizeCanvasLinks(curriculum), [curriculum]);

  if (!curriculum) {
    return jobStatus === "error" ? (
      <div className="p-8 text-primary">Unable to load canvas preview.</div>
    ) : (
      <CanvasLoadingScreen 
        visible={true} 
        title="Preparing preview" 
        statusMessage="Assembling the canvas from backend progress" 
        progress={loadingProgress} 
      />
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-[#090909] text-primary">
      <CanvasResultPage
        key={curriculum.curriculum_id || curriculum.topic || "preview"}
        embedded
        title={curriculum.topic || "Preview"}
        nodes={nodes}
        links={links}
        ready={true}
        curriculumId={curriculum.curriculum_id}
      />
    </div>
  );
}
