import {
  pgTable,
  text,
  timestamp,
  json,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/** Responses table for the Postgres adapter */
export const responses = pgTable(
  "formengine_responses",
  {
    id: text("id").primaryKey(),
    schemaId: text("schema_id").notNull(),
    schemaVersion: text("schema_version").notNull(),
    sessionToken: text("session_token").notNull(),
    data: text("data").notNull(),
    metadata: json("metadata"),
    completionTimeMs: integer("completion_time_ms"),
    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    schemaIdx: index("fe_responses_schema_idx").on(table.schemaId),
    sessionIdx: index("fe_responses_session_idx").on(table.sessionToken),
  }),
);

/** Drafts table for the Postgres adapter */
export const drafts = pgTable(
  "formengine_drafts",
  {
    id: text("id").primaryKey(),
    schemaId: text("schema_id").notNull(),
    sessionToken: text("session_token").notNull(),
    partialData: json("partial_data").notNull(),
    currentSectionId: text("current_section_id"),
    visitedSectionIds: json("visited_section_ids").$type<string[]>(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    sessionUniqueIdx: uniqueIndex("fe_drafts_session_unique_idx").on(
      table.schemaId,
      table.sessionToken,
    ),
    expiresIdx: index("fe_drafts_expires_idx").on(table.expiresAt),
  }),
);
