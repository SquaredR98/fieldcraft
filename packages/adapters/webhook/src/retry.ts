/** Calculate delay for a retry attempt. */
export function calculateDelay(
  attempt: number,
  baseDelay: number,
  backoff: "linear" | "exponential",
): number {
  if (backoff === "linear") return baseDelay * attempt;
  // Exponential with 10% jitter
  const delay = baseDelay * Math.pow(2, attempt - 1);
  const jitter = Math.random() * delay * 0.1;
  return Math.floor(delay + jitter);
}

/** Sleep for a given number of milliseconds. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
