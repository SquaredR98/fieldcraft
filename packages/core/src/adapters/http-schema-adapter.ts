import type { SchemaAdapter, SchemaListParams, SchemaListResult } from "../types/adapters";
import type { FormEngineSchema } from "../types/schema";

export type HttpSchemaAdapterConfig = {
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number;
  /** Cache TTL in milliseconds for `load()` results. 0 disables caching. Default: 60000 (60s). */
  cacheTtl?: number;
};

/**
 * Creates an HTTP schema adapter for CRUD operations on form schemas.
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
  };
}
