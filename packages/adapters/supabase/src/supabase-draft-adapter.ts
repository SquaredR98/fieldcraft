import type { DraftAdapter, DraftData } from "@squaredr/fieldcraft-core";
import type { SupabaseDraftAdapterConfig } from "./types";

/** Create a Supabase draft adapter. */
export function createSupabaseDraftAdapter(
  config: SupabaseDraftAdapterConfig,
): DraftAdapter {
  const tableName = config.table ?? "formengine_drafts";
  const ttlHours = config.ttlHours ?? 72;

  return {
    async save(draft: DraftData): Promise<void> {
      const expiresAt = new Date(
        Date.now() + ttlHours * 60 * 60 * 1000,
      ).toISOString();

      await config.client.from(tableName).upsert(
        {
          schema_id: draft.schemaId,
          session_token: draft.sessionToken,
          partial_data: draft.partialData,
          current_section_id: draft.currentSectionId,
          visited_section_ids: draft.visitedSectionIds,
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "schema_id,session_token" },
      );
    },

    async load(
      schemaId: string,
      sessionToken: string,
    ): Promise<DraftData | null> {
      const { data, error } = await config.client
        .from(tableName)
        .select("*")
        .eq("schema_id", schemaId)
        .eq("session_token", sessionToken)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (error || !data) return null;

      return {
        schemaId: data.schema_id as string,
        sessionToken: data.session_token as string,
        partialData: data.partial_data as Record<string, unknown>,
        currentSectionId: data.current_section_id as string | undefined,
        visitedSectionIds: data.visited_section_ids as string[] | undefined,
        savedAt: data.updated_at as string,
        expiresAt: data.expires_at as string,
      };
    },

    async delete(schemaId: string, sessionToken: string): Promise<void> {
      await config.client
        .from(tableName)
        .delete()
        .eq("schema_id", schemaId)
        .eq("session_token", sessionToken);
    },
  };
}
