import type { SubmitAdapter } from "../types/adapters";
import type { FormResponse } from "../types/response";

export type HttpAdapterConfig = {
  url: string;
  method?: "POST" | "PUT" | "PATCH";
  headers?: Record<string, string>;
  transform?: (response: FormResponse) => unknown;
  timeout?: number;
};

/**
 * Creates an HTTP submit adapter that POSTs form responses to a URL.
 */
export function createHttpAdapter(config: HttpAdapterConfig): SubmitAdapter {
  const method = config.method ?? "POST";
  const timeout = config.timeout ?? 30000;

  return {
    name: `http:${method}:${config.url}`,

    async submit(response: FormResponse): Promise<void> {
      const payload = config.transform ? config.transform(response) : response;

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
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
      } finally {
        clearTimeout(timeoutId);
      }
    },
  };
}
