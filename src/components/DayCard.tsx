"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCircle2, Clock3, ExternalLink, EyeOff, FileText, ThumbsDown, Youtube } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Day as DayType, ProjectDayPlan } from "@/types/curriculum";
import ScoreBadge from "./ScoreBadge";
import { submitCurriculumFeedback } from "@/lib/api";
import { getOrCreateLearningSessionId } from "@/lib/learningSession";

interface DayCardProps {
  curriculumId: string;
  day: DayType;
  projectPlan?: ProjectDayPlan;
  weekNumber: number;
  completed: boolean;
  onToggleComplete: () => void;
  onPlayVideo?: () => void;
  onPlayAlternative?: () => void;
}

function scoreToPercent(score: number) {
  return score <= 1 ? Math.round(score * 100) : Math.round(score);
}

function youtubeThumb(id: string) {
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}

function buildExternalUrl(v: any) {
  if (!v) return undefined;
  if (v.youtube_id) return `https://www.youtube.com/watch?v=${v.youtube_id}`;
  if (v.repo_id) return `https://github.com/${v.repo_id}`;
  if (v.paper_id) return `https://arxiv.org/abs/${v.paper_id}`;
  if (v.doc_id) return v.doc_id;
  return undefined;
}

export default function DayCard({
  curriculumId,
  day,
  projectPlan,
  weekNumber,
  completed,
  onToggleComplete,
  onPlayVideo,
  onPlayAlternative,
}: DayCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [thumbSrc, setThumbSrc] = useState<string | null>(null);
  const [altThumbSrc, setAltThumbSrc] = useState<string | null>(null);
  const [removedContentIds, setRemovedContentIds] = useState<Set<string>>(new Set());
  const [submittingFeedbackFor, setSubmittingFeedbackFor] = useState<string | null>(null);

  const sourceType = day.video.source_type || "youtube";
  const isYouTube = sourceType === "youtube";
  const storageKey = curriculumId ? `curriculum-feedback-hidden-${curriculumId}` : null;

  const primaryScore = useMemo(() => scoreToPercent(day.video.score), [day.video.score]);
  const alternativeScore = useMemo(() => scoreToPercent(day.alternative_video?.score ?? day.video.score), [day.alternative_video?.score, day.video.score]);

  const frontThumb = day.video?.youtube_id ? youtubeThumb(day.video.youtube_id) : null;
  const backThumb = day.alternative_video?.youtube_id ? youtubeThumb(day.alternative_video.youtube_id) : frontThumb;

  useEffect(() => {
    if (thumbSrc === null) setThumbSrc(frontThumb);
    if (altThumbSrc === null) setAltThumbSrc(backThumb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frontThumb, backThumb]);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) setRemovedContentIds(new Set(JSON.parse(stored)));
    } catch {
      // Ignore storage failures.
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(Array.from(removedContentIds)));
    } catch {
      // Ignore storage failures.
    }
  }, [removedContentIds, storageKey]);

  const primaryContentId = day.video.youtube_id || day.video.paper_id || day.video.repo_id || day.video.doc_id || "";
  const alternativeContentId = day.alternative_video?.youtube_id || day.alternative_video?.paper_id || day.alternative_video?.repo_id || day.alternative_video?.doc_id || "";
  const activeContentId = flipped && day.alternative_video ? alternativeContentId : primaryContentId;
  const activeContentRemoved = activeContentId ? removedContentIds.has(activeContentId) : false;

  useEffect(() => {
    if (day.alternative_video && primaryContentId && removedContentIds.has(primaryContentId) && alternativeContentId && !removedContentIds.has(alternativeContentId)) {
      setFlipped(true);
    }

    if (day.alternative_video && alternativeContentId && removedContentIds.has(alternativeContentId) && primaryContentId && !removedContentIds.has(primaryContentId)) {
      setFlipped(false);
    }
  }, [day.alternative_video, primaryContentId, alternativeContentId, removedContentIds]);

  async function removeCurrentPick(reason: string) {
    if (!activeContentId || submittingFeedbackFor === activeContentId) return;

    setSubmittingFeedbackFor(activeContentId);
    setRemovedContentIds((current) => new Set(current).add(activeContentId));

    try {
      const sessionId = getOrCreateLearningSessionId();
      await submitCurriculumFeedback(curriculumId, {
        session_id: sessionId,
        content_quality_rating: 1,
        relevance_rating: 1,
        concepts_to_skip: [day.concept],
        additional_notes: `${reason}: ${day.concept}`,
      });
    } catch (error) {
      console.warn("Failed to submit card feedback", error);
    } finally {
      setSubmittingFeedbackFor(null);
    }

    if (activeContentId === primaryContentId && day.alternative_video && alternativeContentId && !removedContentIds.has(alternativeContentId)) {
      setFlipped(true);
    }
  }

  const face = flipped && day.alternative_video ? "alternative" : "primary";
  const currentVideo = face === "primary" ? day.video : day.alternative_video!;
  const currentThumb = face === "primary" ? (thumbSrc || frontThumb) : (altThumbSrc || backThumb || undefined);
  const currentScore = face === "primary" ? primaryScore : alternativeScore;
  const currentHeaderLabel = face === "primary" ? "Featured video" : "Backup video";
  const currentToggleLabel = face === "primary" ? "Alt view" : "Primary view";
  const currentToggleAction = face === "primary" ? () => setFlipped(true) : () => setFlipped(false);

  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`group relative h-full overflow-visible rounded-[30px] border p-2.5 shadow-[0_18px_40px_rgba(0,0,0,0.24)] sm:p-3 ${completed ? "border-[color:rgba(200,254,2,0.3)] bg-[color:rgba(200,254,2,0.03)]" : "border-subtle bg-card"}`}
    >
      <div className="relative flex h-full flex-col gap-3 overflow-visible rounded-[24px] border border-subtle bg-[color:var(--surface)] p-2.5 sm:p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">Day {String(day.day).padStart(2, "0")}</p>
              {completed ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-[color:rgba(200,254,2,0.25)] bg-[color:rgba(200,254,2,0.08)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--accent)]">
                  <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Completed
                </span>
              ) : null}
              <span className="rounded-full border border-subtle bg-[color:rgba(255,255,255,0.03)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
                {face === "alternative" ? "Alternative view" : "Primary view"}
              </span>
            </div>
            <p className="max-w-[38ch] text-[10px] font-mono uppercase tracking-[0.32em] text-muted">{day.concept}</p>
          </div>

          <button
            type="button"
            onClick={onToggleComplete}
            className={`focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.3em] sm:w-auto ${completed ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-black" : "border-subtle bg-[color:var(--surface)] text-primary"}`}
          >
            <Check className="h-3.5 w-3.5" />
            {completed ? "Completed" : "Mark done"}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeContentRemoved ? (
            <motion.div
              key="removed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex min-h-[16rem] flex-col items-center justify-center rounded-[24px] border border-dashed border-subtle bg-[color:rgba(255,255,255,0.02)] p-6 text-center"
            >
              <EyeOff className="h-8 w-8 text-muted" strokeWidth={1.6} />
              <p className="mt-4 text-lg font-display text-primary">Removed from this curriculum</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted">
                You marked this pick as not helpful, so it will stay hidden for this curriculum.
              </p>
              {day.alternative_video ? (
                <button
                  type="button"
                  onClick={() => setFlipped((current) => !current)}
                  className="focus-ring mt-5 inline-flex items-center gap-2 rounded-full border border-subtle bg-[color:var(--surface)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-primary"
                >
                  {flipped ? "Show primary" : "Show alternative"}
                </button>
              ) : null}
            </motion.div>
          ) : (
            <motion.div
              key={face}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">{currentHeaderLabel}</p>
                  <h3 className="mt-2 line-clamp-3 text-lg font-display leading-tight text-primary sm:text-xl lg:text-2xl">{currentVideo.title}</h3>
                </div>
              </div>

              <div className="relative space-y-4">
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-[26px] border border-subtle bg-[color:#0d0d0d] shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
                    {currentThumb ? (
                      <img
                        src={currentThumb}
                        alt={currentVideo.title}
                        className="aspect-[16/9] w-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          const t = e.currentTarget as HTMLImageElement;
                          t.onerror = null;
                          t.src = "https://via.placeholder.com/640x360?text=No+thumb";
                        }}
                      />
                    ) : (
                      <div className="flex aspect-[16/9] w-full items-center justify-center text-muted">No preview available</div>
                    )}

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-subtle bg-[color:rgba(10,10,10,0.92)] px-2.5 py-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-md">
                        {/* <span className="inline-flex items-center gap-2 rounded-full border border-subtle bg-[color:rgba(255,255,255,0.04)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
                          {currentScore}%
                        </span> */}
                        <button
                          type="button"
                          onClick={() => {
                            if (face === "primary") {
                              if (isYouTube) {
                                onPlayVideo?.();
                              } else {
                                const url = buildExternalUrl(day.video as any);
                                if (url) window.open(url, "_blank", "noopener,noreferrer");
                              }
                              return;
                            }

                            const altVideo = day.alternative_video!;
                            if ((altVideo.source_type || "youtube") === "youtube") {
                              onPlayAlternative?.();
                            } else {
                              const url = buildExternalUrl(altVideo as any);
                              if (url) window.open(url, "_blank", "noopener,noreferrer");
                            }
                          }}
                          className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-[color:var(--accent)] bg-[color:var(--accent)] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.24em] text-black transition-colors hover:brightness-110"
                        >
                          {face === "primary"
                            ? isYouTube
                              ? <Youtube className="h-3 w-3" />
                              : <ExternalLink className="h-3 w-3" />
                            : <Youtube className="h-3 w-3" />}
                          {face === "primary"
                            ? isYouTube
                              ? "Watch"
                              : "Open"
                            : (day.alternative_video?.source_type || "youtube") === "youtube"
                              ? "Watch"
                              : "Open"}
                        </button>
                        {/* Alt view toggle removed from hover controls per UI request */}
                        <button
                          type="button"
                          onClick={() => removeCurrentPick(face === "primary" ? "Not helpful" : "Alternative was not helpful")}
                          disabled={Boolean(submittingFeedbackFor)}
                          className="focus-ring inline-flex items-center justify-center gap-1.5 rounded-full border border-subtle bg-[color:var(--surface)] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.24em] text-muted transition-colors hover:border-[color:var(--accent)] hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <ThumbsDown className="h-3 w-3" />
                          Not helpful
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[26px] border border-[color:rgba(200,254,2,0.16)] bg-[linear-gradient(135deg,rgba(200,254,2,0.08),rgba(255,255,255,0.02))] p-4 sm:p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-6">
                      <div className="min-w-0 flex-1 space-y-2">
                        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[color:var(--accent)]">Focus</p>
                        <p className="text-sm leading-6 text-primary sm:text-[15px]">{currentVideo.why_this_video}</p>
                      </div>
                      {day.alternative_video ? (
                        <button
                          type="button"
                          onClick={currentToggleAction}
                          className="focus-ring self-start rounded-full border border-subtle bg-[color:var(--surface)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted"
                        >
                          {currentToggleLabel}
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-subtle bg-[color:rgba(255,255,255,0.03)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
                      <ExternalLink className="h-3.5 w-3.5" />
                      {currentVideo.channel}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-subtle bg-[color:rgba(255,255,255,0.03)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
                      <Clock3 className="h-3.5 w-3.5" />
                      {Math.round(currentVideo.duration_seconds / 60)} min
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-subtle bg-[color:rgba(255,255,255,0.03)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
                      <FileText className="h-3.5 w-3.5" />
                      {currentVideo.transcript_available ? "Transcript used" : "Metadata scoring"}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-subtle bg-[color:rgba(255,255,255,0.03)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
                      Score <ScoreBadge score={currentScore} />
                    </span>
                  </div>

                  {projectPlan ? (
                    <div className="rounded-[22px] border border-[color:rgba(200,254,2,0.18)] bg-[color:rgba(200,254,2,0.05)] p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--accent)]">Project anchor</p>
                      <p className="mt-2 text-lg font-display text-primary">{projectPlan.project_title}</p>
                      <p className="mt-2 text-sm leading-6 text-primary/80">{projectPlan.description}</p>
                      {projectPlan.success_criteria?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {projectPlan.success_criteria.slice(0, 3).map((item) => (
                            <span key={item} className="rounded-full border border-subtle bg-[color:rgba(255,255,255,0.03)] px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-muted">
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}
