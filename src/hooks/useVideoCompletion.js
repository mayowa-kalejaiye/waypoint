import { useState, useCallback, useEffect } from "react";
import { recordContentInteraction } from "../api/waypoint";
import { getOrCreateLearningSessionId } from "../lib/learningSession";

/**
 * Hook to manage video completion tracking
 * Stores completion status in localStorage
 */
export const useVideoCompletion = (curriculumId) => {
  const storageKey = `curriculum-completion-${curriculumId}`;
  const [completed, setCompleted] = useState(new Set());

  // Load from localStorage on mount
  useEffect(() => {
    if (!curriculumId) return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setCompleted(new Set(JSON.parse(stored)));
      }
    } catch (err) {
      console.error("Failed to load completion state:", err);
    }
  }, [curriculumId, storageKey]);

  // Save to localStorage whenever completed changes
  useEffect(() => {
    if (!curriculumId) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(completed)));
    } catch (err) {
      console.error("Failed to save completion state:", err);
    }
  }, [completed, curriculumId, storageKey]);

  const toggleComplete = useCallback(
    (videoId) => {
      setCompleted((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(videoId)) {
          newSet.delete(videoId);
        } else {
          newSet.add(videoId);
        }
        return newSet;
      });
    },
    []
  );

  const markComplete = useCallback((videoId, concept) => {
    setCompleted((prev) => new Set(prev).add(videoId));

    // Fire-and-forget to backend to persist interaction
    try {
      const sessionId = getOrCreateLearningSessionId();
      recordContentInteraction({
        session_id: sessionId,
        curriculum_id: curriculumId,
        content_id: videoId,
        source: "youtube",
        concept: concept,
        interaction_type: "complete",
      }).catch((err) => console.warn("Failed to record interaction", err));
    } catch (e) {
      console.warn("Failed to send interaction", e);
    }
  }, [curriculumId]);

  const isComplete = useCallback(
    (videoId) => completed.has(videoId),
    [completed]
  );

  return {
    completed,
    toggleComplete,
    markComplete,
    isComplete,
  };
};
