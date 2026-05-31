export const GENERIC_REQUEST_ERROR = "We couldn't complete that request right now. Please try again.";

export function getFriendlyErrorMessage(error: unknown, fallback = GENERIC_REQUEST_ERROR): string {
  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }

  if (error instanceof Error) {
    const status = (error as any).status;
    const body = (error as any).body;

    if (status === 404) {
      return "That curriculum no longer exists. Returning to home.";
    }

    if (typeof body === "string" && body.trim()) {
      try {
        const parsed = JSON.parse(body) as { detail?: unknown };
        if (typeof parsed.detail === "string" && parsed.detail.trim()) {
          return parsed.detail;
        }
      } catch {
        // Fall through to message parsing.
      }

      if (body.length < 200) {
        return body;
      }
    }

    if (error.message && error.message !== "Error") {
      return error.message;
    }

    return fallback;
  }

  return fallback;
}
