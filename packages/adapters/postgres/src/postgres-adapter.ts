import { drizzle } from "drizzle-orm/postgres-js";
import pg from "postgres";
import type { SubmitAdapter, FormResponse } from "@squaredr/formengine-core";
import { createId } from "@paralleldrive/cuid2";
import type { PostgresAdapterConfig } from "./types";
import { encrypt } from "./encryption";
import { responses } from "./schema";

/** Create a Postgres submit adapter using Drizzle ORM. */
export function createPostgresAdapter(
  config: PostgresAdapterConfig,
): SubmitAdapter {
  const client = pg(config.connectionString, {
    ssl: config.ssl ?? (process.env.NODE_ENV === "production"),
  });
  const db = drizzle(client);

  return {
    name: "postgres",

    async submit(response: FormResponse): Promise<void> {
      const dataString = JSON.stringify(response.values);
      const encryptedData = config.encryptionKey
        ? encrypt(dataString, config.encryptionKey)
        : dataString;

      await db.insert(responses).values({
        id: createId(),
        schemaId: response.schemaId,
        schemaVersion: response.schemaVersion,
        sessionToken: response.sessionToken,
        data: encryptedData,
        metadata: response.metadata,
        completionTimeMs: response.completionTimeMs,
      });

      config.onSuccess?.(response);
    },

    onError: config.onError,
  };
}
