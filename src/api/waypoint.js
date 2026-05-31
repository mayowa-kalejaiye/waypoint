const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const GENERIC_REQUEST_ERROR = "We couldn't complete that request right now. Please try again.";

export async function generateCurriculum(payload) {
  const response = await fetch(`${API_BASE_URL}/api/v1/curriculum/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`Request failed for generateCurriculum:`, text);
    throw new Error(GENERIC_REQUEST_ERROR);
  }

  return response.json();
}

export async function getCurriculumJob(jobId) {
  const response = await fetch(`${API_BASE_URL}/api/v1/curriculum/jobs/${jobId}`);
  if (!response.ok) {
    const text = await response.text();
    console.error(`Request failed for getCurriculumJob(${jobId}):`, text);
    throw new Error(GENERIC_REQUEST_ERROR);
  }

  return response.json();
}

export async function getCurriculum(curriculumId) {
  const response = await fetch(`${API_BASE_URL}/api/v1/curriculum/${curriculumId}`);
  if (!response.ok) {
    const text = await response.text();
    console.error(`Request failed for getCurriculum(${curriculumId}):`, text);
    throw new Error(GENERIC_REQUEST_ERROR);
  }

  return response.json();
}

export async function recordContentInteraction(payload) {
  const response = await fetch(`${API_BASE_URL}/api/v1/curriculum/content/interaction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`Request failed for recordContentInteraction:`, text);
    throw new Error(GENERIC_REQUEST_ERROR);
  }

  return response.json();
}

async function getCurriculumJobWithRetry(jobId) {
  try {
    return await getCurriculumJob(jobId);
  } catch (error) {
    // Retry once for transient errors (network issues, brief backend restart)
    console.warn("First poll attempt failed, retrying once:", error);
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      return await getCurriculumJob(jobId);
    } catch (retryError) {
      throw error;
    }
  }
}

export async function waitForCurriculumJob(jobId, { intervalMs = 1500, timeoutMs = 120000 } = {}) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const job = await getCurriculumJobWithRetry(jobId);
    if (job.status === "completed") {
      return job;
    }

    if (job.status === "failed") {
      throw new Error(GENERIC_REQUEST_ERROR);
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(GENERIC_REQUEST_ERROR);
}
