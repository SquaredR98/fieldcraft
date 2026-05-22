import type {
  SchemaAdapter,
  SchemaListParams,
  SchemaListResult,
  FormEngineSchema,
} from "@squaredr/fieldcraft-core";
import type { SupabaseSchemaAdapterConfig } from "./types";

/**
 * Create a Supabase schema adapter for persisting FormEngineSchema documents.
 *
 * Requires a `formengine_schemas` table (or custom name) with the following columns:
 *
 * ```sql
 * create table formengine_schemas (
 *   id text primary key,
 *   title text not null default '',
 *   version text not null default '1.0.0',
 *   status text not null default 'draft',
 *   definition jsonb not null,
 *   created_at timestamptz not null default now(),
 *   updated_at timestamptz not null default now()
 * );
 * ```
 */
export function createSupabaseSchemaAdapter(
  config: SupabaseSchemaAdapterConfig,
): SchemaAdapter {
  const tableName = config.table ?? "formengine_schemas";

  return {
    name: "supabase-schema",

    async save(schema: FormEngineSchema): Promise<void> {
      const { error } = await config.client.from(tableName).upsert(
        {
          id: schema.id,
          title: schema.title ?? "",
          version: schema.version ?? "1.0.0",
          status: "draft",
          definition: schema,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );

      if (error) {
        const err = new Error(`Supabase schema save failed: ${error.message}`);
        config.onError?.(err);
        throw err;
      }
    },

    async load(schemaId: string): Promise<FormEngineSchema | null> {
      const { data, error } = await config.client
        .from(tableName)
        .select("definition")
        .eq("id", schemaId)
        .single();

      if (error || !data) return null;

      return data.definition as FormEngineSchema;
    },

    async delete(schemaId: string): Promise<void> {
      const { error } = await config.client
        .from(tableName)
        .delete()
        .eq("id", schemaId) as { error: Error | null };

      if (error) {
        const err = new Error(`Supabase schema delete failed: ${error.message}`);
        config.onError?.(err);
        throw err;
      }
    },

    async list(params?: SchemaListParams): Promise<SchemaListResult> {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 20;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = config.client
        .from(tableName)
        .select("id, title, version, status, created_at, updated_at");

      if (params?.search) {
        query = query.ilike("title", `%${params.search}%`);
      }

      if (params?.status) {
        query = query.eq("status", params.status);
      }

      const sortBy = params?.sortBy ?? "updatedAt";
      const sortOrder = params?.sortOrder ?? "desc";
      const columnMap: Record<string, string> = {
        title: "title",
        updatedAt: "updated_at",
        createdAt: "created_at",
      };
      const sortColumn = columnMap[sortBy] ?? "updated_at";

      query = query
        .order(sortColumn, { ascending: sortOrder === "asc" })
        .range(from, to);

      const { data, error } = await query.then((res: { data: unknown; error: Error | null }) => res) as unknown as {
        data: Array<Record<string, unknown>> | null;
        error: Error | null;
      };

      if (error || !data) {
        return { items: [], total: 0, page, pageSize };
      }

      const items = data.map((row) => ({
        id: row.id as string,
        title: row.title as string,
        version: row.version as string,
        updatedAt: row.updated_at as string,
        createdAt: row.created_at as string,
        status: row.status as "draft" | "published" | "archived" | undefined,
      }));

      return {
        items,
        total: items.length < pageSize ? from + items.length : from + pageSize + 1,
        page,
        pageSize,
      };
    },

    onError: config.onError,
  };
}
