import type { FormResponse } from "./response";
import type { FormEngineSchema } from "./schema";

/**
 * Interface for submission adapters that persist form responses.
 *
 * @description Implement this interface to send form submissions to any backend:
 * databases, REST APIs, webhooks, etc. Multiple adapters can be registered —
 * the engine calls each one on submit.
 *
 * @example
 * ```typescript
 * const apiAdapter: SubmitAdapter = {
 *   name: "rest-api",
 *   async submit(response) {
 *     await fetch("/api/responses", {
 *       method: "POST",
 *       body: JSON.stringify(response),
 *     });
 *   },
 * };
 * ```
 *
 * @since 1.0.0
 */
export interface SubmitAdapter {
  /** Unique name identifying this adapter in submit results. */
  name: string;
  /** Persists a form response. Called by the engine after validation passes. */
  submit(response: FormResponse): Promise<void>;
  /** Optional error handler invoked when `submit()` throws. */
  onError?: (error: Error) => void;
}

/**
 * Interface for draft persistence adapters. Enables server-side draft storage
 * as an alternative or complement to localStorage.
 *
 * @since 1.0.0
 */
export interface DraftAdapter {
  /** Saves a draft snapshot. Called periodically by the auto-save system. */
  save(draft: DraftData): Promise<void>;
  /** Loads a previously saved draft. Returns `null` if no draft exists or it has expired. */
  load(schemaId: string, sessionToken: string): Promise<DraftData | null>;
  /** Permanently deletes a saved draft. Called on successful form submission. */
  delete(schemaId: string, sessionToken: string): Promise<void>;
}

/**
 * Snapshot of a partially completed form, saved for later resumption.
 *
 * @since 1.0.0
 */
export type DraftData = {
  /** Schema ID this draft belongs to. */
  schemaId: string;
  /** Session token linking this draft to a user session. */
  sessionToken: string;
  /** Partial form values at time of save. */
  partialData: Record<string, unknown>;
  /** Section the user was on when the draft was saved. */
  currentSectionId?: string;
  /** Sections the user had already visited. */
  visitedSectionIds?: string[];
  /** ISO timestamp of when the draft was saved. */
  savedAt: string;
  /** ISO timestamp of when the draft expires and should be discarded. */
  expiresAt: string;
};

/**
 * Interface for analytics/telemetry adapters that track user behavior within forms.
 *
 * @since 1.0.0
 */
export interface AnalyticsAdapter {
  /** Fires when the form is loaded/viewed. */
  trackView(schemaId: string): void;
  /** Fires when the user begins filling out the form. */
  trackStart(schemaId: string, sectionId: string): void;
  /** Fires on field focus, blur, or value change. */
  trackFieldInteraction(fieldId: string, type: "focus" | "blur" | "change"): void;
  /** Fires when a section is completed with the time spent in milliseconds. */
  trackSectionComplete(sectionId: string, timeMs: number): void;
  /** Fires on successful form submission with total time. */
  trackSubmit(schemaId: string, totalTimeMs: number): void;
  /** Fires when a user abandons the form (navigates away without submitting). */
  trackAbandon(schemaId: string, lastSectionId: string): void;
}

/**
 * Metadata for a schema in a listing/browse context.
 *
 * @since 1.0.0
 */
export type SchemaListItem = {
  /** Schema ID. */
  id: string;
  /** Schema title. */
  title: string;
  /** Schema version string. */
  version: string;
  /** ISO timestamp of last update. */
  updatedAt: string;
  /** ISO timestamp of creation. */
  createdAt: string;
  /** Publication status of the schema. */
  status?: "draft" | "published" | "archived";
};

/**
 * Parameters for filtering and paginating schema lists.
 *
 * @since 1.0.0
 */
export type SchemaListParams = {
  /** Page number (1-indexed). */
  page?: number;
  /** Number of items per page. */
  pageSize?: number;
  /** Search query matched against schema title. */
  search?: string;
  /** Filter by publication status. */
  status?: "draft" | "published" | "archived";
  /** Field to sort by. */
  sortBy?: "title" | "updatedAt" | "createdAt";
  /** Sort direction. */
  sortOrder?: "asc" | "desc";
};

/**
 * Paginated result set from `SchemaAdapter.list()`.
 *
 * @since 1.0.0
 */
export type SchemaListResult = {
  /** Array of schema metadata items for the current page. */
  items: SchemaListItem[];
  /** Total number of schemas matching the query (across all pages). */
  total: number;
  /** Current page number. */
  page: number;
  /** Page size used for this query. */
  pageSize: number;
};

/**
 * Interface for schema persistence adapters. Enables CRUD operations on form schemas
 * stored in databases, file systems, or APIs.
 *
 * @since 1.0.0
 */
export interface SchemaAdapter {
  /** Unique name identifying this adapter. */
  name: string;
  /** Saves a schema. Creates if new, updates if existing. */
  save(schema: FormEngineSchema): Promise<void>;
  /** Loads a schema by ID. Returns `null` if not found. */
  load(schemaId: string): Promise<FormEngineSchema | null>;
  /** Permanently deletes a schema by ID. */
  delete(schemaId: string): Promise<void>;
  /** Lists schemas with optional filtering, sorting, and pagination. */
  list(params?: SchemaListParams): Promise<SchemaListResult>;
  /** Optional error handler. */
  onError?: (error: Error) => void;
}
