import type { SubmitAdapter } from "../types/adapters";
import type { FormResponse } from "../types/response";

export type HttpAdapterConfig = {
  url: string;
  method?: "POST" | "PUT" | "PATCH";
  headers?: Record<string, string>;
  transform?: (response: FormResponse) => unknown;
  timeout?: number;
  /** Number of retry attempts on network errors or 5xx responses. 0 disables retry. Default: 3. */
  retries?: number;
};

/**
 * Creates an HTTP submit adapter that POSTs form responses to a URL.
 */
export function createHttpAdapter(config: HttpAdapterConfig): SubmitAdapter {
  const method = config.method ?? "POST";
  const timeout = config.timeout ?? 30000;
  const maxRetries = config.retries ?? 3;

  async function attempt(payload: unknown): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(config.url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...config.headers,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = new Error(`HTTP ${res.status}: ${res.statusText}`);
        (err as any).status = res.status;
        throw err;
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  function isRetryable(err: unknown): boolean {
    if (!(err instanceof Error)) return false;
    const status = (err as any).status as number | undefined;
    // Retry on network errors (no status) or 5xx server errors
    if (!status) return true;
    return status >= 500;
  }

  function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return {
    name: `http:${method}:${config.url}`,

    async submit(response: FormResponse): Promise<void> {
      const payload = config.transform ? config.transform(response) : response;

      let lastError: unknown;
      for (let i = 0; i <= maxRetries; i++) {
        try {
          await attempt(payload);
          return;
        } catch (err) {
          lastError = err;
          if (i < maxRetries && isRetryable(err)) {
            // Exponential backoff: 1s, 2s, 4s... with ±25% jitter
            const base = 1000 * Math.pow(2, i);
            const jitter = base * 0.25 * (Math.random() * 2 - 1);
            await delay(base + jitter);
            continue;
          }
          throw err;
        }
      }
      throw lastError;
    },
  };
}
