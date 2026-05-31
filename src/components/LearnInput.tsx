"use client";

import { useState } from "react";

interface Props {
  onResults: (nodes: any[]) => void;
}

export default function LearnInput({ onResults }: Props) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e?: any) {
    if (e) e.preventDefault();
    if (!q) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/v1/rank?query=${encodeURIComponent(q)}`);
      if (res.ok) {
        const json = await res.json();
        // backend should return array of videos; fall back to structure flexibility
        const videos = json.videos || json.items || json || [];
        onResults(videos.map((v: any, i: number) => ({
          id: v.id || v.youtube_id || `node-${i}`,
          title: v.title || v.name || v.video_title || "Untitled",
          youtube_id: v.youtube_id || v.youtubeId,
          url: v.url || v.link || undefined,
          duration_seconds: v.duration_seconds || v.durationSeconds,
          channel: v.channel || v.creator || undefined,
          score: typeof v.score === "number" ? v.score : undefined,
          thumbnail_url: v.thumbnail_url || (v.youtube_id || v.youtubeId ? `https://img.youtube.com/vi/${v.youtube_id || v.youtubeId}/hqdefault.jpg` : undefined),
          x: 120 + i * 180,
          y: 100 + Math.sin(i * 0.9) * 34 + (i % 2 === 0 ? -10 : 16),
        })));
        setLoading(false);
        return;
      }
    } catch (err) {
      // ignore and return empty state
    }

    onResults([]);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={`What do you want to learn?`}
        className="flex-1 rounded-md border px-3 py-2"
      />
      <button type="submit" disabled={loading} className="rounded-md bg-slate-900 px-4 py-2 text-white">
        {loading ? "Searching..." : "Find playlist"}
      </button>
    </form>
  );
}
