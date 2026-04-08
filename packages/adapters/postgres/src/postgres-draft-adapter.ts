import { drizzle } from "drizzle-orm/postgres-js";
import pg from "postgres";
import { eq, and, gt } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import type { DraftAdapter, DraftData } from "@squaredr/fieldcraft-core";
import type { PostgresDraftAdapterConfig } from "./types";
import { drafts } from "./schema";

/** Create a Postgres draft adapter using Drizzle ORM. */
export function createPostgresDraftAdapter(
  config: PostgresDraftAdapterConfig,
): DraftAdapter {
  const client = pg(config.connectionString, {
    ssl: config.ssl ?? (process.env.NODE_ENV === "production"),
  });
  const db = drizzle(client);
  const ttlHours = config.ttlHours ?? 72;

  return {
    async save(draft: DraftData): Promise<void> {
      const expiresAt = new Date(
        Date.now() + ttlHours * 60 * 60 * 1000,
      );

      // Check for existing
      const [existing] = await db
        .select({ id: drafts.id })
        .from(drafts)
        .where(
          and(
            eq(drafts.schemaId, draft.schemaId),
            eq(drafts.sessionToken, draft.sessionToken),
          ),
        )
        .limit(1);

      if (existing) {
        await db
          .update(drafts)
          .set({
            partialData: draft.partialData,
            currentSectionId: draft.currentSectionId ?? null,
            visitedSectionIds: draft.visitedSectionIds ?? null,
            expiresAt,
            updatedAt: new Date(),
          })
          .where(eq(drafts.id, existing.id));
      } else {
        await db.insert(drafts).values({
          id: createId(),
          schemaId: draft.schemaId,
          sessionToken: draft.sessionToken,
          partialData: draft.partialData,
          currentSectionId: draft.currentSectionId ?? null,
          visitedSectionIds: draft.visitedSectionIds ?? null,
          expiresAt,
        });
      }
    },

    async load(
      schemaId: string,
      sessionToken: string,
    ): Promise<DraftData | null> {
      const [record] = await db
        .select()
        .from(drafts)
        .where(
          and(
            eq(drafts.schemaId, schemaId),
            eq(drafts.sessionToken, sessionToken),
            gt(drafts.expiresAt, new Date()),
          ),
        )
        .limit(1);

      if (!record) return null;

      return {
        schemaId: record.schemaId,
        sessionToken: record.sessionToken,
        partialData: record.partialData as Record<string, unknown>,
        currentSectionId: record.currentSectionId ?? undefined,
        visitedSectionIds: record.visitedSectionIds ?? undefined,
        savedAt: record.updatedAt.toISOString(),
        expiresAt: record.expiresAt.toISOString(),
      };
    },

    async delete(schemaId: string, sessionToken: string): Promise<void> {
      await db
        .delete(drafts)
        .where(
          and(
            eq(drafts.schemaId, schemaId),
            eq(drafts.sessionToken, sessionToken),
          ),
        );
    },
  };
}
