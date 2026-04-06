import type { FormResponse } from "@squaredr/formengine-core";

export type WebhookAdapterConfig = {
  /** Webhook endpoint URL (HTTPS recommended) */
  url: string;
  /** HMAC signing secret */
  secret: string;
  /** Max retries (default: 3) */
  retries?: number;
  /** Base retry delay in ms (default: 1000) */
  retryDelayMs?: number;
  /** Backoff strategy (default: "exponential") */
  retryBackoff?: "linear" | "exponential";
  /** Request timeout in ms (default: 30000) */
  timeoutMs?: number;
  /** Additional headers to send */
  headers?: Record<string, string>;
  /** Transform the response before sending */
  transform?: (response: FormResponse) => unknown;
  /** Called after successful delivery */
  onSuccess?: (response: FormResponse, statusCode: number) => void;
  /** Called on each error */
  onError?: (error: Error, attempt: number) => void;
  /** Called before each retry */
  onRetry?: (attempt: number, delay: number) => void;
};
