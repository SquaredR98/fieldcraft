import type { SubmitAdapter, FormResponse } from "@squaredr/fieldcraft-core";
import type { WebhookAdapterConfig } from "./types";
import { signPayload } from "./signer";
import { calculateDelay, sleep } from "./retry";

/** Create a webhook submit adapter with HMAC signing and retries. */
export function createWebhookAdapter(
  config: WebhookAdapterConfig,
): SubmitAdapter {
  const maxRetries = config.retries ?? 3;
  const baseDelay = config.retryDelayMs ?? 1000;
  const backoff = config.retryBackoff ?? "exponential";
  const timeoutMs = config.timeoutMs ?? 30000;

  return {
    name: "webhook",

    async submit(response: FormResponse): Promise<void> {
      const payload = config.transform
        ? config.transform(response)
        : response;

      const body = JSON.stringify(payload);
      const signature = signPayload(body, config.secret);

      for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(
            () => controller.abort(),
            timeoutMs,
          );

          const res = await fetch(config.url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-FormEngine-Signature": `sha256=${signature}`,
              "X-FormEngine-Event": "submit",
              "X-FormEngine-Timestamp": new Date().toISOString(),
              ...config.headers,
            },
            body,
            signal: controller.signal,
          });

          clearTimeout(timeout);

          if (res.ok) {
            config.onSuccess?.(response, res.status);
            return;
          }

          throw new Error(
            `Webhook returned ${res.status}: ${res.statusText}`,
          );
        } catch (error) {
          config.onError?.(error as Error, attempt);

          if (attempt <= maxRetries) {
            const delay = calculateDelay(attempt, baseDelay, backoff);
            config.onRetry?.(attempt, delay);
            await sleep(delay);
          } else {
            throw error;
          }
        }
      }
    },

    onError: config.onError
      ? (err) => config.onError!(err, 0)
      : undefined,
  };
}
