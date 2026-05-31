"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, RefreshCw, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface VideoPlayerContext {
  topic?: string;
  weekLabel?: string;
  dayLabel?: string;
  concept?: string;
  channel?: string;
  durationLabel?: string;
  scoreLabel?: string;
  whyThisVideo?: string;
  projectTitle?: string;
  projectDescription?: string;
  transcriptAvailable?: boolean;
  durationAdvice?: string;
}

interface VideoPlayerProps {
  youtubeId: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  context?: VideoPlayerContext;
}

type PlayerStatus = "loading" | "ready" | "error";

let youtubeApiPromise: Promise<void> | null = null;

function loadYouTubeIframeApi() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube player is unavailable in this environment."));
  }

  const globalWindow = window as Window & {
    YT?: { Player?: new (element: HTMLElement | string, options: any) => any };
    onYouTubeIframeAPIReady?: () => void;
  };

  if (globalWindow.YT?.Player) {
    return Promise.resolve();
  }

  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise<void>((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>('script[data-waypoint-youtube-api="true"]');

      const finish = () => {
        if (globalWindow.YT?.Player) {
          resolve();
          return;
        }

        window.setTimeout(finish, 50);
      };

      const previousCallback = globalWindow.onYouTubeIframeAPIReady;
      globalWindow.onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        finish();
      };

      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        script.dataset.waypointYoutubeApi = "true";
        script.onerror = () => reject(new Error("Unable to load the YouTube player."));
        document.head.appendChild(script);
      } else {
        finish();
      }
    }).catch((error) => {
      youtubeApiPromise = null;
      throw error;
    });
  }

  return youtubeApiPromise;
}

function describePlayerError(code?: number) {
  switch (code) {
    case 2:
      return "This video can't be played here. Open it on YouTube to watch.";
    case 5:
      return "The player encountered a technical issue. Try again or watch on YouTube.";
    case 100:
      return "This video is no longer available.";
    case 101:
    case 150:
      return "This video can't be embedded here, but you can still watch it on YouTube.";
    default:
      return "This video can't be played in the player right now.";
  }
}

export default function VideoPlayer({
  youtubeId,
  title,
  isOpen,
  onClose,
  onComplete,
  context,
}: VideoPlayerProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const [status, setStatus] = useState<PlayerStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  const watchUrl = useMemo(() => `https://www.youtube.com/watch?v=${youtubeId}`, [youtubeId]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let cancelled = false;
    setStatus("loading");
    setErrorMessage(null);

    const bootPlayer = async () => {
      try {
        await loadYouTubeIframeApi();

        if (cancelled || !hostRef.current) {
          return;
        }

        const globalWindow = window as Window & {
          YT?: { Player?: new (element: HTMLElement | string, options: any) => any };
        };

        if (playerRef.current && typeof playerRef.current.destroy === "function") {
          playerRef.current.destroy();
        }

        hostRef.current.innerHTML = "";

        const PlayerConstructor = globalWindow.YT?.Player;

        if (!PlayerConstructor) {
          throw new Error("Unable to initialize the YouTube player.");
        }

        playerRef.current = new PlayerConstructor(hostRef.current, {
          videoId: youtubeId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              if (!cancelled) {
                setStatus("ready");
              }
            },
            onError: (event: { data?: number }) => {
              if (!cancelled) {
                const friendlyMsg = describePlayerError(event.data);
                setErrorMessage(friendlyMsg);
                setStatus("error");
              }
            },
          },
        });
      } catch (error) {
        if (!cancelled) {
          const friendlyMsg = describePlayerError();
          setErrorMessage(friendlyMsg);
          setStatus("error");
        }
      }
    };

    bootPlayer();

    return () => {
      cancelled = true;

      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        playerRef.current.destroy();
      }

      playerRef.current = null;

      if (hostRef.current) {
        hostRef.current.innerHTML = "";
      }
    };
  }, [isOpen, retryToken, youtubeId]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.985 }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6"
          >
            <div className="flex h-[min(98vh,1120px)] w-full max-w-[1760px] flex-col overflow-hidden rounded-[34px] border border-[#1E1E1E] bg-[#0A0A0A] shadow-[0_40px_120px_rgba(0,0,0,0.7)]">
              <div className="flex items-start justify-between gap-4 border-b border-[#1E1E1E] bg-[#111111] px-4 py-4 sm:px-6">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#666666]">Watch session</p>
                  <h2 className="mt-2 truncate text-xl font-display text-white sm:text-2xl">{context?.topic || title}</h2>
                  <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[#999999]">
                    {context?.weekLabel ? <span className="rounded-full border border-[#1E1E1E] bg-[#0D0D0D] px-2.5 py-1 text-[#CCCCCC]">{context.weekLabel}</span> : null}
                    {context?.dayLabel ? <span className="rounded-full border border-[#1E1E1E] bg-[#0D0D0D] px-2.5 py-1 text-[#CCCCCC]">{context.dayLabel}</span> : null}
                    {context?.concept ? <span className="rounded-full border border-[color:rgba(200,254,2,0.16)] bg-[color:rgba(200,254,2,0.06)] px-2.5 py-1 text-[color:var(--accent)]">{context.concept}</span> : null}
                    {context?.durationLabel ? <span className="rounded-full border border-[#1E1E1E] bg-[#0D0D0D] px-2.5 py-1 text-[#CCCCCC]">{context.durationLabel}</span> : null}
                    {context?.scoreLabel ? <span className="rounded-full border border-[#1E1E1E] bg-[#0D0D0D] px-2.5 py-1 text-[#CCCCCC]">Score {context.scoreLabel}</span> : null}
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="flex-shrink-0 rounded-full border border-[#1E1E1E] bg-[#0D0D0D] p-3 text-[#888888] transition-colors hover:text-white"
                  aria-label="Close video player"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1.8fr)_minmax(280px,0.42fr)]">
                <div className="flex min-h-0 flex-col border-b border-[#1E1E1E] lg:border-b-0 lg:border-r">
                  <div className="flex items-center justify-between gap-3 border-b border-[#1E1E1E] px-4 py-3 sm:px-6">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#666666]">Focus mode</p>
                      <p className="mt-1 text-sm text-[#999999]">The video is the main lesson surface.</p>
                    </div>
                    <div className="rounded-full border border-[color:rgba(200,254,2,0.16)] bg-[color:rgba(200,254,2,0.06)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[color:var(--accent)]">
                      Full width watch
                    </div>
                  </div>

                  <div className="relative flex min-h-0 flex-1 items-stretch justify-stretch bg-[#0A0A0A] p-3 sm:p-4 lg:p-6">
                    <div className="relative flex min-h-[540px] w-full flex-col overflow-hidden rounded-[30px] border border-[#1E1E1E] bg-[#090909] shadow-[0_22px_70px_rgba(0,0,0,0.35)] lg:min-h-[680px]">
                      <div className="relative flex-1 bg-[#050505]">
                        <div ref={hostRef} className="absolute inset-0 h-full w-full" />
                        {status !== "ready" ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A]/95">
                            <div className="space-y-3 text-center">
                              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[#C8FE02] border-t-transparent" />
                              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#666666]">
                                {status === "error" ? "Playback unavailable" : "Loading embedded player"}
                              </p>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <div className="border-t border-[#1E1E1E] bg-[#111111] px-5 py-4 sm:px-6">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                          <div className="max-w-3xl">
                            <h3 className="text-2xl font-display text-white sm:text-3xl">{title}</h3>
                            <p className="mt-2 text-sm leading-6 text-[#999999]">
                              {context?.whyThisVideo || "Watch without losing your place. The lesson context stays visible alongside the video."}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[#999999]">
                            {context?.channel ? <span className="rounded-full border border-[#1E1E1E] bg-[#0D0D0D] px-2.5 py-1 text-[#CCCCCC]">{context.channel}</span> : null}
                            {context?.durationLabel ? <span className="rounded-full border border-[#1E1E1E] bg-[#0D0D0D] px-2.5 py-1 text-[#CCCCCC]">{context.durationLabel}</span> : null}
                            {context?.scoreLabel ? <span className="rounded-full border border-[#1E1E1E] bg-[#0D0D0D] px-2.5 py-1 text-[#CCCCCC]">Score {context.scoreLabel}</span> : null}
                          </div>
                        </div>
                      </div>

                      {status === "error" ? (
                        <div className="border-t border-[#1E1E1E] bg-[#111111] px-5 py-5 sm:px-6">
                          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                            <div className="rounded-[24px] border border-[#1E1E1E] bg-[#0D0D0D] p-5 sm:p-6">
                              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#666666]">Playback unavailable</p>
                              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#AAAAAA]">{errorMessage ?? describePlayerError()}</p>
                            </div>

                            <div className="flex flex-col gap-3 rounded-[24px] border border-[#1E1E1E] bg-[#0D0D0D] p-5 sm:p-6">
                              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#666666]">Actions</p>
                              <a
                                href={watchUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1E1E1E] bg-[#111111] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#1A1A1A]"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Open on YouTube
                              </a>
                              {onComplete ? (
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => {
                                    onComplete();
                                    onClose();
                                  }}
                                  className="rounded-full bg-[#C8FE02] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-black transition-all hover:brightness-110"
                                >
                                  Mark complete
                                </motion.button>
                              ) : null}
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setRetryToken((current) => current + 1)}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1E1E1E] bg-[#111111] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#1A1A1A]"
                              >
                                <RefreshCw className="h-4 w-4" />
                                Try again
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <aside className="flex min-h-0 flex-col gap-4 overflow-y-auto p-4 sm:p-6">
                  <div className="rounded-[24px] border border-[#1E1E1E] bg-[#111111] p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#666666]">Lesson context</p>
                    <p className="mt-2 text-sm leading-7 text-[#AAAAAA]">{context?.whyThisVideo || describePlayerError()}</p>
                  </div>

                  {context?.projectTitle ? (
                    <div className="rounded-[24px] border border-[color:rgba(200,254,2,0.18)] bg-[color:rgba(200,254,2,0.05)] p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[color:var(--accent)]">Project anchor</p>
                      <p className="mt-2 text-lg font-display text-white">{context.projectTitle}</p>
                      {context.projectDescription ? <p className="mt-2 text-sm leading-7 text-[#B6B6B6]">{context.projectDescription}</p> : null}
                    </div>
                  ) : null}

                  <div className="grid gap-3">
                    <div className="rounded-[22px] border border-[#1E1E1E] bg-[#111111] p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#666666]">Transcript</p>
                      <p className="mt-2 text-sm leading-6 text-white">{context?.transcriptAvailable ? "Available for scoring" : "Unavailable, scored from metadata"}</p>
                    </div>
                    {context?.durationAdvice ? (
                      <div className="rounded-[22px] border border-[#1E1E1E] bg-[#111111] p-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#666666]">Pacing note</p>
                        <p className="mt-2 text-sm leading-6 text-[#AAAAAA]">{context.durationAdvice}</p>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-auto flex flex-col gap-3 border-t border-[#1E1E1E] pt-4">
                    {onComplete ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onComplete();
                          onClose();
                        }}
                        className="rounded-full bg-[#C8FE02] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-black transition-all hover:brightness-110"
                      >
                        Mark complete
                      </motion.button>
                    ) : null}
                    <a
                      href={watchUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1E1E1E] bg-[#111111] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#1A1A1A]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open on YouTube
                    </a>
                  </div>
                </aside>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
