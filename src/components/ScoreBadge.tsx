"use client";

import { useEffect, useState } from "react";

interface ScoreBadgeProps {
  score: number;
}

export default function ScoreBadge({ score }: ScoreBadgeProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let frame = 0;
    const startedAt = performance.now();
    const duration = 600;

    const animate = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      setDisplayScore(Math.round(score * progress));
      if (progress < 1) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="inline-flex items-center rounded-full border border-[color:var(--accent)] bg-[color:var(--accent)] px-2.5 py-1 text-[10px] font-bold tracking-[0.24em] text-black">
      {displayScore}%
    </div>
  );
}
