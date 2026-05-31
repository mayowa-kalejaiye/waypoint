import { getOrCreateLearningIdentity } from "@/lib/identity";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

function getLaunchUrl(path: string): string {
  return `${BACKEND_BASE_URL}${path}`;
}

async function postLaunchJson<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(getLaunchUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    keepalive: true,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  return response.json() as Promise<T>;
}

export async function trackLaunchEvent(eventName: string, properties: Record<string, unknown> = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const identity = getOrCreateLearningIdentity();
  const pagePath = window.location.pathname;

  try {
    await postLaunchJson<{ success: boolean }>("/api/v1/launch/events", {
      event_name: eventName,
      session_id: identity.sessionId,
      page_path: pagePath,
      properties: {
        ...properties,
        username: identity.username,
      },
    });
  } catch (error) {
    console.warn("Launch analytics event failed:", eventName, error);
  }
}

export async function submitLaunchWaitlist(payload: { email: string; name?: string }) {
  const identity = getOrCreateLearningIdentity();

  return postLaunchJson<{ success: boolean; message?: string }>("/api/v1/launch/waitlist", {
    email: payload.email,
    name: payload.name || "",
    source: "launch_waitlist",
    session_id: identity.sessionId,
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
    properties: {
      username: identity.username,
      source_surface: "homepage_waitlist",
    },
  });
}
