import type { SubmitAdapter, FormResponse } from "@squaredr/formengine-core";
import type { SupabaseAdapterConfig } from "./types";
import { encryptFields } from "./encryption";

/** Create a Supabase submit adapter. */
export function createSupabaseAdapter(
  config: SupabaseAdapterConfig,
): SubmitAdapter {
  return {
    name: "supabase",

    async submit(response: FormResponse): Promise<void> {
      let values = { ...response.values };

      if (config.encryptFields?.length && config.encryptionKey) {
        values = encryptFields(
          values,
          config.encryptFields,
          config.encryptionKey,
        );
      }

      const { error } = await config.client
        .from(config.table ?? "formengine_responses")
        .insert({
          schema_id: response.schemaId,
          schema_version: response.schemaVersion,
          session_token: response.sessionToken,
          data: values,
          metadata: response.metadata,
          completion_time_ms: response.completionTimeMs,
          submitted_at: response.submittedAt,
        });

      if (error) {
        const err = new Error(`Supabase insert failed: ${error.message}`);
        config.onError?.(err);
        throw err;
      }

      config.onSuccess?.(response, values);
    },

    onError: config.onError,
  };
}
