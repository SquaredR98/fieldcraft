import type { FormResponse } from "@squaredr/fieldcraft-core";

export type SupabaseAdapterConfig = {
  /** Supabase client instance from @supabase/supabase-js */
  client: SupabaseClient;
  /** Table name for responses (default: "formengine_responses") */
  table?: string;
  /** Field IDs to encrypt at rest */
  encryptFields?: string[];
  /** Base64-encoded 32-byte encryption key */
  encryptionKey?: string;
  /** Called after successful insert */
  onSuccess?: (response: FormResponse, record: unknown) => void;
  /** Called on error */
  onError?: (error: Error) => void;
};

export type SupabaseDraftAdapterConfig = {
  /** Supabase client instance */
  client: SupabaseClient;
  /** Table name for drafts (default: "formengine_drafts") */
  table?: string;
  /** Draft time-to-live in hours (default: 72) */
  ttlHours?: number;
};

/** Minimal Supabase client shape so we don't require the full dependency */
export type SupabaseClient = {
  from(table: string): SupabaseQueryBuilder;
};

type SupabaseQueryBuilder = {
  insert(values: Record<string, unknown>): SupabaseFilterBuilder;
  select(columns?: string): SupabaseFilterBuilder;
  upsert(
    values: Record<string, unknown>,
    options?: { onConflict?: string },
  ): SupabaseFilterBuilder;
  delete(): SupabaseFilterBuilder;
};

type SupabaseFilterBuilder = {
  eq(column: string, value: unknown): SupabaseFilterBuilder;
  gt(column: string, value: unknown): SupabaseFilterBuilder;
  single(): Promise<{ data: Record<string, unknown> | null; error: Error | null }>;
  then(
    resolve: (value: { data: unknown; error: Error | null }) => void,
  ): Promise<void>;
  // Make it work as a promise
  [Symbol.toStringTag]?: string;
};
