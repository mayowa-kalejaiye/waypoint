"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CanvasLoadingScreen from "@/components/CanvasLoadingScreen";
import CanvasResults from "@/components/CanvasResults";

type SavedCanvasNode = {
  id: string;
  title: string;
  youtube_id?: string;
  url?: string;
  duration_seconds?: number;
  channel?: string;
  score?: number;
  thumbnail_url?: string;
  x?: number;
  y?: number;
};

type SavedCanvasLink = {
  id: string;
  from: string;
  to: string;
};

type SavedCanvasPayload = {
  nodes: SavedCanvasNode[];
  links?: SavedCanvasLink[];
  title?: string;
};

export default function PublicCanvasPage() {
  const params = useParams<{ id: string }>();
  const canvasId = params?.id;
  const [payload, setPayload] = useState<SavedCanvasPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadCanvas() {
      if (!canvasId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/v1/canvas/${canvasId}`);
        if (!response.ok) {
          throw new Error("Failed to load canvas");
        }
        const data = (await response.json()) as SavedCanvasPayload;
        if (!cancelled) {
          setPayload(data);
        }
      } catch {
        if (!cancelled) {
          setPayload(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCanvas();
    return () => {
      cancelled = true;
    };
  }, [canvasId]);

  if (loading) {
    return <CanvasLoadingScreen visible={true} title="Loading your results" statusMessage="Please wait while we build the canvas" />;
  }

  if (!payload) {
    return <div className="min-h-screen bg-[#090909] px-6 py-8 text-primary">Canvas not found.</div>;
  }

  return <CanvasResults nodes={payload.nodes} links={payload.links || []} storageKey={`canvas:${canvasId}`} ready={(payload.nodes || []).length > 0} title={payload.title || "Learning canvas"} />;
}
