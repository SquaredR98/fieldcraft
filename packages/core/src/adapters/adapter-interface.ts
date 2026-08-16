import type { FormResponse, SubmitResult } from "../types/response";

/**
 * Base interface for building custom form adapters.
 *
 * @description Implement this interface when creating adapters that handle
 * form lifecycle operations beyond simple submission. For simple submit-only
 * adapters, use `SubmitAdapter` instead.
 *
 * @example
 * ```typescript
 * class MyAdapter implements FormAdapter {
 *   name = "my-adapter";
 *
 *   async submit(response: FormResponse) {
 *     await fetch("/api/submit", { method: "POST", body: JSON.stringify(response) });
 *     return { success: true, adapterResults: [{ adapterName: this.name, success: true }] };
 *   }
 *
 *   async healthCheck() {
 *     const res = await fetch("/api/health");
 *     return res.ok;
 *   }
 *
 *   destroy() {
 *     // Clean up connections, timers, etc.
 *   }
 * }
 * ```
 *
 * @since 1.4.0
 */
export interface FormAdapter {
  /** Unique name identifying this adapter. */
  name: string;

  /** Submits a form response and returns the result. */
  submit(response: FormResponse): Promise<SubmitResult>;

  /**
   * Optional health check. Returns `true` if the adapter's backend is reachable.
   * Useful for pre-submit checks or dashboard status indicators.
   */
  healthCheck?(): Promise<boolean>;

  /**
   * Optional cleanup method. Called when the engine is destroyed.
   * Use this to close connections, clear timers, etc.
   */
  destroy?(): void;

  /** Optional error handler invoked when `submit()` throws. */
  onError?: (error: Error) => void;
}
