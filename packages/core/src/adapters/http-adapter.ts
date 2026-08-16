import type { SubmitAdapter } from "../types/adapters";
import type { FormResponse } from "../types/response";

/**
 * Configuration for {@link createHttpAdapter}.
 *
 * @property url - The endpoint to send form responses to
 * @property method - HTTP method. Defaults to `"POST"`
 * @property headers - Additional headers merged with `Content-Type: application/json`
 * @property transform - Optional function to reshape the `FormResponse` before sending
 * @property timeout - Request timeout in milliseconds. Defaults to 30000 (30s)
 * @property retries - Number of retry attempts on network errors or 5xx responses.
 *   Uses exponential backoff with jitter. Set to 0 to disable. Defaults to 3.
 */
export type HttpAdapterConfig = {
  url: string;
  method?: "POST" | "PUT" | "PATCH";
  headers?: Record<string, string>;
  transform?: (response: FormResponse) => unknown;
  /** Transform the HTTP response body after a successful request. @since 1.4.0 */
  transformResponse?: (body: unknown) => unknown;
  timeout?: number;
  retries?: number;
  /** Callback fired on each retry attempt. Receives the attempt number (1-based) and the error. @since 1.4.0 */
  onRetry?: (attempt: number, error: Error) => void;
};

/**
 * Creates a `SubmitAdapter` that sends form responses to an HTTP endpoint.
 *
 * Retries on network errors and 5xx responses with exponential backoff
 * (1s, 2s, 4s... with jitter). Client errors (4xx) fail immediately.
 *
 * @param config - Endpoint URL, method, headers, and retry settings
 * @returns A `SubmitAdapter` with a `submit(response)` method
 *
 * @example
 * ```ts
 * const adapter = createHttpAdapter({
 *   url: "https://api.example.com/forms/submit",
 *   headers: { Authorization: "Bearer token" },
 *   retries: 2,
 * });
 * ```
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

      // Transform response body if configured
      if (config.transformResponse) {
        const body = await res.json();
        config.transformResponse(body);
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
            config.onRetry?.(i + 1, err instanceof Error ? err : new Error(String(err)));
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
