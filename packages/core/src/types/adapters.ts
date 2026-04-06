import type { FormResponse } from "./response";

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
