import type { SchemaAdapter, SchemaListParams, SchemaListResult } from "../types/adapters";
import type { FormEngineSchema } from "../types/schema";

/**
 * Configuration for {@link createHttpSchemaAdapter}.
 *
 * @property baseUrl - Base URL for the schema API (e.g. `"https://api.example.com"`)
 * @property headers - Additional headers sent with every request
 * @property timeout - Request timeout in milliseconds. Defaults to 30000 (30s)
 * @property cacheTtl - Cache TTL in milliseconds for `load()` results.
 *   Set to 0 to disable caching. Defaults to 60000 (60s).
 */
export type HttpSchemaAdapterConfig = {
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number;
  cacheTtl?: number;
};

/**
 * Creates a `SchemaAdapter` that performs CRUD operations on form schemas
 * via a REST API. Endpoints:
 *
 * - `PUT /schemas/:id` — save/update a schema
 * - `GET /schemas/:id` — load a schema (with in-memory cache)
 * - `DELETE /schemas/:id` — delete a schema
 * - `GET /schemas` — list schemas (with pagination, search, sorting)
 *
 * Load results are cached in memory for `cacheTtl` milliseconds.
 * Save and delete operations invalidate the cache for the affected schema.
 *
 * @param config - Base URL, headers, timeout, and cache settings
 * @returns A `SchemaAdapter` with `save`, `load`, `delete`, and `list` methods
 *
 * @example
 * ```ts
 * const schemas = createHttpSchemaAdapter({
 *   baseUrl: "https://api.example.com",
 *   headers: { Authorization: "Bearer token" },
 * });
 *
 * const schema = await schemas.load("contact-form");
 * await schemas.save(updatedSchema);
 * ```
 */
export function createHttpSchemaAdapter(config: HttpSchemaAdapterConfig): SchemaAdapter {
  const timeout = config.timeout ?? 30000;
  const cacheTtl = config.cacheTtl ?? 60_000;
  const cache = new Map<string, { data: FormEngineSchema; timestamp: number }>();

  async function request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(`${config.baseUrl}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...config.headers,
          ...options.headers,
        },
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      return res.json() as Promise<T>;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return {
    name: `http-schema:${config.baseUrl}`,

    async save(schema: FormEngineSchema): Promise<void> {
      await request(`/schemas/${schema.id}`, {
        method: "PUT",
        body: JSON.stringify(schema),
      });
      cache.delete(schema.id);
    },

    async load(schemaId: string): Promise<FormEngineSchema | null> {
      if (cacheTtl > 0) {
        const cached = cache.get(schemaId);
        if (cached && Date.now() - cached.timestamp < cacheTtl) {
          return cached.data;
        }
      }

      try {
        const data = await request<FormEngineSchema>(`/schemas/${schemaId}`);
        if (cacheTtl > 0 && data) {
          cache.set(schemaId, { data, timestamp: Date.now() });
        }
        return data;
      } catch {
        return null;
      }
    },

    async delete(schemaId: string): Promise<void> {
      await request(`/schemas/${schemaId}`, { method: "DELETE" });
      cache.delete(schemaId);
    },

    async list(params?: SchemaListParams): Promise<SchemaListResult> {
      const query = new URLSearchParams();

      if (params) {
        if (params.page != null) query.set("page", String(params.page));
        if (params.pageSize != null) query.set("pageSize", String(params.pageSize));
        if (params.search) query.set("search", params.search);
        if (params.status) query.set("status", params.status);
        if (params.sortBy) query.set("sortBy", params.sortBy);
        if (params.sortOrder) query.set("sortOrder", params.sortOrder);
      }

      const qs = query.toString();
      return request<SchemaListResult>(`/schemas${qs ? `?${qs}` : ""}`);
    },

    /**
     * Checks if the schema API is reachable by sending a HEAD request to `/schemas`.
     * Returns `true` if the server responds with a 2xx status.
     * @since 1.4.0
     */
    async healthCheck(): Promise<boolean> {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      try {
        const res = await fetch(`${config.baseUrl}/schemas`, {
          method: "HEAD",
          headers: { ...config.headers },
          signal: controller.signal,
        });
        return res.ok;
      } catch {
        return false;
      } finally {
        clearTimeout(timeoutId);
      }
    },

    /**
     * Clears the in-memory schema cache. Optionally pass a schema ID to
     * invalidate only that entry; omit to clear the entire cache.
     * @since 1.4.0
     */
    invalidateCache(schemaId?: string): void {
      if (schemaId) {
        cache.delete(schemaId);
      } else {
        cache.clear();
      }
    },
  };
}
