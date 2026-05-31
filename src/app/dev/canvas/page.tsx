"use client";

import CanvasResults from "@/components/CanvasResults";

const demoNodes = [
  { id: "n1", title: "Intro to React", youtube_id: "dQw4w9WgXcQ" },
  { id: "n2", title: "JSX Deep Dive", youtube_id: "eXampleId2" },
  { id: "n3", title: "Hooks Overview", youtube_id: "eXampleId3" },
  { id: "n4", title: "State & Props", youtube_id: "eXampleId4" },
];

export default function DevCanvasPage() {
  return (
    <div className="min-h-screen bg-[#090909] text-primary">
      <div className="mx-auto max-w-[1600px] px-4 py-8">
        <h1 className="mb-4 text-3xl font-bold">Canvas Dev Test</h1>
        <CanvasResults nodes={demoNodes} storageKey="dev-canvas" ready={demoNodes.length > 0} />
      </div>
    </div>
  );
}
