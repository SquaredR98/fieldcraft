import type { FormResponse } from "./response";
import type { FormEngineSchema } from "./schema";

export interface SubmitAdapter {
  name: string;
  submit(response: FormResponse): Promise<void>;
  onError?: (error: Error) => void;
}

export interface DraftAdapter {
  save(draft: DraftData): Promise<void>;
  load(schemaId: string, sessionToken: string): Promise<DraftData | null>;
  delete(schemaId: string, sessionToken: string): Promise<void>;
}

export type DraftData = {
  schemaId: string;
  sessionToken: string;
  partialData: Record<string, unknown>;
  currentSectionId?: string;
  visitedSectionIds?: string[];
  savedAt: string;
  expiresAt: string;
};

export interface AnalyticsAdapter {
  trackView(schemaId: string): void;
  trackStart(schemaId: string, sectionId: string): void;
  trackFieldInteraction(fieldId: string, type: "focus" | "blur" | "change"): void;
  trackSectionComplete(sectionId: string, timeMs: number): void;
  trackSubmit(schemaId: string, totalTimeMs: number): void;
  trackAbandon(schemaId: string, lastSectionId: string): void;
}

export type SchemaListItem = {
  id: string;
  title: string;
  version: string;
  updatedAt: string;
  createdAt: string;
  status?: "draft" | "published" | "archived";
};

export type SchemaListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "draft" | "published" | "archived";
  sortBy?: "title" | "updatedAt" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export type SchemaListResult = {
  items: SchemaListItem[];
  total: number;
  page: number;
  pageSize: number;
};

export interface SchemaAdapter {
  name: string;
  save(schema: FormEngineSchema): Promise<void>;
  load(schemaId: string): Promise<FormEngineSchema | null>;
  delete(schemaId: string): Promise<void>;
  list(params?: SchemaListParams): Promise<SchemaListResult>;
  onError?: (error: Error) => void;
}
