"use client";

import { useState } from "react";
import { Play, ExternalLink, AlertCircle, Video, CheckCircle2, Circle, Code2, FileText, Github, BookOpen } from "lucide-react";

export default function DayCard({ day, isComplete, markComplete }) {
  const [imageError, setImageError] = useState(false);
  
  // Determine content type and build appropriate URLs
  const sourceType = day.video.source_type || "youtube";
  let thumb, contentUrl, icon, contentLabel;
  
  if (sourceType === "paper") {
    thumb = null; // Papers don't have thumbnails
    contentUrl = `https://arxiv.org/abs/${day.video.paper_id}`;
    icon = FileText;
    contentLabel = "Research Paper";
  } else if (sourceType === "repo") {
    thumb = null; // Repos don't have thumbnails
    contentUrl = `https://github.com/${day.video.repo_id}`;
    icon = Github;
    contentLabel = "Repository";
  } else if (sourceType === "doc") {
    thumb = null; // Docs don't have thumbnails
    contentUrl = day.video.doc_id; // Assume doc_id is a URL
    icon = BookOpen;
    contentLabel = "Documentation";
  } else {
    // Default to YouTube
    thumb = `https://img.youtube.com/vi/${day.video.youtube_id}/mqdefault.jpg`;
    contentUrl = day.video.url || `https://www.youtube.com/watch?v=${day.video.youtube_id}`;
    icon = Video;
    contentLabel = "Video";
  }
  
  // Build alternative content URL if available
  let alternativeUrl = null;
  if (day.alternative_video) {
    const altSourceType = day.alternative_video.source_type || "youtube";
    if (altSourceType === "paper") {
      alternativeUrl = `https://arxiv.org/abs/${day.alternative_video.paper_id}`;
    } else if (altSourceType === "repo") {
      alternativeUrl = `https://github.com/${day.alternative_video.repo_id}`;
    } else if (altSourceType === "doc") {
      alternativeUrl = day.alternative_video.doc_id;
    } else {
      alternativeUrl = day.alternative_video.url || `https://www.youtube.com/watch?v=${day.alternative_video.youtube_id}`;
    }
  }

  const durationMinutes = sourceType === "youtube" 
    ? Math.round(day.video.duration_seconds / 60)
    : null;
  const readingTimeMinutes = day.video.reading_time_minutes;
  const scorePercentage = Math.round(Number(day.video.score) * 100);
  const contentId = day.video.youtube_id || day.video.paper_id || day.video.repo_id || day.video.doc_id;
  const isContentComplete = isComplete?.(contentId) || false;
  
  const IconComponent = icon;

  return (
    <article className={`px-6 py-6 transition-colors ${isContentComplete ? "bg-emerald-50" : "hover:bg-amber-50"}`}>
      {/* Day Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">Day {day.day}</p>
            {isContentComplete && (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" strokeWidth={2.5} fill="currentColor" />
            )}
          </div>
          <h4 className="text-lg font-semibold text-slate-900">{day.concept}</h4>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-slate-600 mb-1">Quality</p>
          <p className="text-sm font-semibold text-slate-900">{scorePercentage}%</p>
        </div>
      </div>

      {/* Content Card */}
      <div className="space-y-4">
        <div className="group rounded-lg overflow-hidden border border-slate-300 bg-slate-100 hover:border-slate-400 transition-all">
          {thumb ? (
            /* Video Thumbnail */
            <div className="relative w-full bg-slate-200" style={{ aspectRatio: "16/9" }}>
              {!imageError ? (
                <img
                  src={thumb}
                  alt={day.video.title}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-contain group-hover:brightness-75 transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Video className="h-8 w-8 text-slate-400" strokeWidth={1.5} />
                </div>
              )}
              <a
                href={contentUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors duration-300"
                aria-label="Open content"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-5 w-5 text-white ml-0.5" strokeWidth={2.5} fill="white" />
                </div>
              </a>
            </div>
          ) : (
            /* Non-video Content Placeholder */
            <div className="relative w-full bg-gradient-to-br from-slate-300 to-slate-400" style={{ aspectRatio: "16/9" }}>
              <a
                href={contentUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"
              >
                <IconComponent className="h-16 w-16 text-slate-600 group-hover:text-slate-700" strokeWidth={1.5} />
                <span className="text-sm font-semibold text-slate-700">{contentLabel}</span>
              </a>
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="space-y-3">
          <div>
            <a
              className="text-base font-semibold text-slate-900 hover:text-amber-600 transition-colors flex items-start gap-2 group"
              href={contentUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span className="flex-1 leading-snug">{day.video.title}</span>
              <ExternalLink className="h-4 w-4 flex-shrink-0 mt-0.5 text-slate-400 group-hover:text-amber-600 transition-colors" strokeWidth={2} />
            </a>
            <p className="text-sm text-slate-600 mt-2">
              <span className="text-slate-700">{day.video.channel}</span>
              {durationMinutes && <> • <span>{durationMinutes} min</span></>}
              {readingTimeMinutes && <> • <span>{readingTimeMinutes} min read</span></>}
            </p>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {day.video.why_this_video}
          </p>

            {day.hands_on_project && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-600 text-white shrink-0">
                    <Code2 className="h-4 w-4" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-widest font-medium text-amber-700">Hands-on project</p>
                    <h5 className="mt-1 text-sm font-semibold text-amber-950">{day.hands_on_project.name}</h5>
                    <p className="mt-1 text-sm text-amber-900 leading-relaxed">
                      {day.hands_on_project.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-amber-900">
                  {day.hands_on_project.estimated_hours && (
                    <span className="rounded-full bg-white/70 px-2.5 py-1 border border-amber-200">
                      ~{day.hands_on_project.estimated_hours}h
                    </span>
                  )}
                  {(day.hands_on_project.skills_practiced || []).slice(0, 4).map((skill) => (
                    <span key={skill} className="rounded-full bg-white/70 px-2.5 py-1 border border-amber-200">
                      {skill}
                    </span>
                  ))}
                </div>

                {day.hands_on_project.github_url && (
                  <a
                    href={day.hands_on_project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-amber-800 hover:text-amber-950 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" strokeWidth={2} />
                    Open starter project
                  </a>
                )}
              </div>
            )}

          {!day.video.transcript_available && (
            <div className="flex gap-3 rounded-lg bg-amber-50 border border-amber-300 p-3">
              <AlertCircle className="h-4 w-4 text-amber-700 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <p className="text-xs text-amber-800">
                Transcript unavailable. Quality score based on title and description.
              </p>
            </div>
          )}
        </div>

        {/* Alternative Content */}
        {day.alternative_video && (
          <div className="mt-4 rounded-lg border border-slate-300 bg-slate-100 p-4 space-y-3">
            <p className="text-xs text-slate-600 uppercase tracking-widest font-medium">Alternative</p>
            <a
              href={alternativeUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2 group text-sm font-medium text-slate-900 hover:text-amber-600 transition-colors"
            >
              <span className="text-slate-700">{day.video.channel}</span> • <span>{durationMinutes} min</span>
            </p>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {day.video.why_this_video}
          </p>

            {day.hands_on_project && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-600 text-white shrink-0">
                    <Code2 className="h-4 w-4" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-widest font-medium text-amber-700">Hands-on project</p>
                    <h5 className="mt-1 text-sm font-semibold text-amber-950">{day.hands_on_project.name}</h5>
                    <p className="mt-1 text-sm text-amber-900 leading-relaxed">
                      {day.hands_on_project.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-amber-900">
                  {day.hands_on_project.estimated_hours && (
                    <span className="rounded-full bg-white/70 px-2.5 py-1 border border-amber-200">
                      ~{day.hands_on_project.estimated_hours}h
                    </span>
                  )}
                  {(day.hands_on_project.skills_practiced || []).slice(0, 4).map((skill) => (
                    <span key={skill} className="rounded-full bg-white/70 px-2.5 py-1 border border-amber-200">
                      {skill}
                    </span>
                  ))}
                </div>

                {day.hands_on_project.github_url && (
                  <a
                    href={day.hands_on_project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-amber-800 hover:text-amber-950 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" strokeWidth={2} />
                    Open starter project
                  </a>
                )}
              </div>
            )}

          {!day.video.transcript_available && (
            <div className="flex gap-3 rounded-lg bg-amber-50 border border-amber-300 p-3">
              <AlertCircle className="h-4 w-4 text-amber-700 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <p className="text-xs text-amber-800">
                Transcript unavailable. Quality score based on title and description.
              </p>
            </div>
          )}
        </div>

        {/* Alternative Video */}
        {day.alternative_video && (
          <div className="mt-4 rounded-lg border border-slate-300 bg-slate-100 p-4 space-y-3">
            <p className="text-xs text-slate-600 uppercase tracking-widest font-medium">Alternative</p>
            <a
              href={alternativeUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2 group text-sm font-medium text-slate-900 hover:text-amber-600 transition-colors"
            >
              <span className="flex-1">{day.alternative_video.title}</span>
              <ExternalLink className="h-4 w-4 flex-shrink-0 mt-0.5 text-slate-400 group-hover:text-amber-600 transition-colors" strokeWidth={2} />
            </a>
            <p className="text-xs text-slate-600">{day.alternative_video.channel}</p>
          </div>
        )}

        {/* Hands-on Project Suggestion */}
        {day.hands_on_project && (
          <div className="mt-4 rounded-lg border border-slate-300 bg-slate-100 p-4 space-y-3">
            <p className="text-xs text-slate-600 uppercase tracking-widest font-medium">Hands-on Project</p>
            <a
              href={day.hands_on_project.github_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2 group text-sm font-medium text-slate-900 hover:text-amber-600 transition-colors"
            >
              <span className="flex-1">{day.hands_on_project.name}</span>
              <ExternalLink className="h-4 w-4 flex-shrink-0 mt-0.5 text-slate-400 group-hover:text-amber-600 transition-colors" strokeWidth={2} />
            </a>
            <p className="text-xs text-slate-600">{day.hands_on_project.description}</p>
            <p className="text-xs text-slate-600">Estimated: {day.hands_on_project.estimated_hours}h • Skills: { (day.hands_on_project.skills_practiced || []).join(', ') }</p>
          </div>
        )}
        {/* Mark Complete Button */}
        {markComplete && (
          <button
            onClick={() => markComplete(videoId, day.concept)}
            className={`mt-4 w-full py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              isVideoComplete
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {isVideoComplete ? (
              <>
                <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                Completed
              </>
            ) : (
              <>
                <Circle className="h-4 w-4" strokeWidth={2} />
                Mark Complete
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
}
