import type { FormResponse, SubmitResult } from "../types/response";
import type { SubmitAdapter } from "../types/adapters";

/**
 * Run the submission pipeline: send the response to all adapters concurrently.
 *
 * If an onSubmit callback is provided, it takes precedence — adapters are skipped.
 * Each adapter failure calls adapter.onError but doesn't block other adapters.
 */
export async function runSubmission(
  response: FormResponse,
  adapters: SubmitAdapter[],
  onSubmit?: (response: FormResponse) => void | Promise<void>,
): Promise<SubmitResult> {
  // Callback override: if onSubmit is provided, use it instead of adapters
  if (onSubmit) {
    try {
      await onSubmit(response);
      return {
        success: true,
        adapterResults: [{ adapterName: "onSubmit", success: true }],
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Submission callback failed";
      return {
        success: false,
        adapterResults: [{ adapterName: "onSubmit", success: false, error: message }],
      };
    }
  }

  // No adapters configured
  if (adapters.length === 0) {
    return { success: true, adapterResults: [] };
  }

  // Run all adapters concurrently
  const results = await Promise.allSettled(
    adapters.map(async (adapter) => {
      try {
        await adapter.submit(response);
        return { adapterName: adapter.name, success: true } as const;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        adapter.onError?.(err instanceof Error ? err : new Error(message));
        return { adapterName: adapter.name, success: false, error: message } as const;
      }
    }),
  );

  const adapterResults = results.map((result) => {
    if (result.status === "fulfilled") {
      return result.value;
    }
    // This shouldn't happen since we catch errors above, but just in case
    return {
      adapterName: "unknown",
      success: false,
      error: result.reason instanceof Error ? result.reason.message : "Unknown error",
    };
  });

  const allSucceeded = adapterResults.every((r) => r.success);

  return {
    success: allSucceeded,
    adapterResults,
  };
}
