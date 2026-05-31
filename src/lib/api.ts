import { GENERIC_REQUEST_ERROR } from "@/lib/userMessages";
import type { Curriculum, CurriculumJobResponse, GenerateCurriculumRequest } from "@/types/curriculum";

function getBackendUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
  return `${baseUrl}${path}`;
}

export function isCurriculumFinalized(curriculum: Pick<Curriculum, "weeks"> | null | undefined): boolean {
  return Array.isArray(curriculum?.weeks) && curriculum.weeks.length > 0;
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const url = getBackendUrl(path);
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`Request failed for ${url}:`, text);
    const err: any = new Error(GENERIC_REQUEST_ERROR);
    err.status = response.status;
    err.body = text;
    throw err;
  }

  return response.json() as Promise<T>;
}

export function generateCurriculum(payload: GenerateCurriculumRequest): Promise<CurriculumJobResponse> {
  return requestJson<CurriculumJobResponse>("/api/v1/curriculum/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurriculum(curriculumId: string): Promise<Curriculum> {
  return requestJson<Curriculum>(`/api/v1/curriculum/${curriculumId}`);
}

export function getCurriculumJob(jobId: string): Promise<CurriculumJobResponse> {
  return requestJson<CurriculumJobResponse>(`/api/v1/curriculum/jobs/${jobId}`);
}

export function expandCurriculum(curriculumId: string): Promise<Curriculum> {
  return requestJson<Curriculum>(`/api/v1/curriculum/${curriculumId}/expand`, {
    method: "POST",
  });
}

async function getCurriculumJobWithRetry(jobId: string): Promise<CurriculumJobResponse> {
  try {
    return await getCurriculumJob(jobId);
  } catch (error) {
    // Retry once for transient errors (network issues, brief backend restart)
    console.warn("First poll attempt failed, retrying once:", error);
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      return await getCurriculumJob(jobId);
    } catch (retryError) {
      // Second attempt failed, throw the original error
      throw error;
    }
  }
}

export async function waitForCurriculum(jobId: string, onProgress?: (progress: number) => void): Promise<Curriculum> {
  const startedAt = Date.now();
  const estimateMs = 45000;  // Observed backend runtime is ~41s for some goals; keep the bar realistic.
  let pollDelayMs = 5000;

  while (true) {
    const job = await getCurriculumJobWithRetry(jobId);

    const elapsed = Date.now() - startedAt;
    const percent = Math.min(92, Math.round((elapsed / estimateMs) * 92));
    onProgress?.(percent);

    if (job.status === "failed") {
      throw new Error(GENERIC_REQUEST_ERROR);
    }

    if (job.status === "completed" && job.curriculum_id) {
      const curriculum = await getCurriculum(job.curriculum_id);
      if (isCurriculumFinalized(curriculum)) {
        onProgress?.(100);
        return curriculum;
      }

      onProgress?.(Math.min(96, percent + 2));
    }

    // Back off a little to avoid hammering the API while still checking frequently enough for completion.
    await new Promise((resolve) => setTimeout(resolve, pollDelayMs));
    pollDelayMs = Math.min(15000, Math.round(pollDelayMs * 1.5));
  }
}

export async function getSenses(term: string): Promise<string[]> {
  const response = await requestJson<{ senses: string[] }>(
    `/api/v1/curriculum/senses?term=${encodeURIComponent(term)}`
  );
  return response.senses || [];
}

export async function recordContentInteraction(payload: Record<string, unknown>): Promise<{ success: boolean }> {
  return requestJson<{ success: boolean }>("/api/v1/curriculum/content/interaction", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function submitCurriculumFeedback(
  curriculumId: string,
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> {
  return requestJson<Record<string, unknown>>(`/api/v1/curriculum/${encodeURIComponent(curriculumId)}/feedback`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
