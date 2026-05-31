"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import CanvasLoadingScreen from "@/components/CanvasLoadingScreen";
import CanvasResultPage from "@/components/CanvasResults";
import { isCurriculumFinalized, waitForCurriculum } from "@/lib/api";

function curriculumToCanvasNodes(curriculum) {
  return curriculum.weeks?.flatMap((week, weekIndex) =>
    week.days.map((day, dayIndex) => ({
      id: `${week.week}-${day.day}`,
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
  ) || [];
}

function synthesizeCanvasLinks(curriculum) {
  const nodes = curriculumToCanvasNodes(curriculum);
  const links = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    links.push({ id: `link-${nodes[i].id}-${nodes[i + 1].id}`, from: nodes[i].id, to: nodes[i + 1].id });
  }
  return links;
}

export default function CanvasPreviewPage() {
  const [curriculum, setCurriculum] = useState(null);
  const [jobStatus, setJobStatus] = useState("idle");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const searchParams = useSearchParams();

  const curriculumCacheKey = (curriculumId) => (curriculumId ? `waypoint:curriculum:${curriculumId}` : null);

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
              const parsed = JSON.parse(cached);
              if (!cancelled && parsed?.curriculum_id === curriculumId && isCurriculumFinalized(parsed)) {
                setLoadingProgress(100);
                setCurriculum(parsed);
                return;
              }
            }
          }

          setLoadingProgress(25);
          const response = await fetch(`/api/v1/curriculum/${curriculumId}`);
          if (response.ok) {
            const data = await response.json();
            if (!cancelled && isCurriculumFinalized(data)) {
              setLoadingProgress(100);
              setCurriculum(data);
              try {
                if (cacheKey) {
                  window.localStorage.setItem(cacheKey, JSON.stringify(data));
                }
              } catch {}
            } else if (!cancelled) {
              setJobStatus("loading");
              setLoadingProgress(60);
            }
          }
          return;
        }

        if (jobId) {
          setJobStatus("loading");
          setLoadingProgress(5);
          const data = await waitForCurriculum(jobId, (progress) => {
            if (!cancelled) {
              setLoadingProgress(progress);
            }
          });
          if (!cancelled) {
            setLoadingProgress(100);
            setCurriculum(data);
            setJobStatus("ready");
            try {
              const cacheKey = curriculumCacheKey(data.curriculum_id);
              if (cacheKey) {
                window.localStorage.setItem(cacheKey, JSON.stringify(data));
              }
              window.localStorage.setItem("waypoint:curriculum:last", JSON.stringify(data));
            } catch {}
          }
          return;
        }

        const stored = window.localStorage.getItem("waypoint:curriculum:last");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (!cancelled && isCurriculumFinalized(parsed)) {
            setCurriculum(parsed);
          } else if (!cancelled) {
            setJobStatus("loading");
            setLoadingProgress(60);
          }
          return;
        }

      } catch {
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

  const nodes = useMemo(() => (curriculum ? curriculumToCanvasNodes(curriculum) : []), [curriculum]);
  const links = useMemo(() => (curriculum ? synthesizeCanvasLinks(curriculum) : []), [curriculum]);

  if (!curriculum) {
      if (jobStatus === "error") {
        return <div className="p-8 text-primary">Unable to load canvas preview.</div>;
      }
  
      if (searchParams.get("job_id") || searchParams.get("curriculum_id") || jobStatus === "loading") {
        return <CanvasLoadingScreen visible={true} title="Loading your results" statusMessage="Please wait while we build the canvas" />;
    }

    return <div className="min-h-screen bg-[#090909]" />;
  }

  return (
    <div className="relative h-screen overflow-hidden bg-[#090909] text-primary">
      {curriculum.warning ? (
        <div className="absolute left-4 right-4 top-4 z-30 rounded-2xl border border-[color:rgba(255,177,77,0.35)] bg-[color:rgba(255,177,77,0.12)] px-4 py-3 text-[color:#ffcf8f] shadow-[0_16px_40px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:left-6 sm:right-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em]">Warning</p>
          <p className="mt-1 text-sm leading-6">{curriculum.warning}</p>
        </div>
      ) : null}
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
