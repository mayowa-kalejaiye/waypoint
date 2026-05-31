export function getOrCreateLearningSessionId() {
  if (typeof window === "undefined") {
    return "";
  }

  const storageKey = "learning_session_id";
  const existing = window.localStorage.getItem(storageKey);
  if (existing) {
    return existing;
  }

  const sessionId = window.crypto?.randomUUID?.() || `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(storageKey, sessionId);
  return sessionId;
}
