export type FormState = {
  values: Record<string, unknown>;
  errors: Record<string, string[]>;
  touched: Record<string, boolean>;
  isDirty: boolean;

  isSubmitting: boolean;
  isSubmitted: boolean;
  submitError?: string;
  submitAttempted: boolean;

  currentSectionId: string;
  currentSectionIndex: number;
  totalVisibleSections: number;
  progressPercent: number;
  visibleSectionIds: string[];
  visitedSectionIds: string[];

  canGoNext: boolean;
  canGoPrev: boolean;
  isCurrentSectionValid: boolean;

  scores: Record<string, number>;
  totalScore?: number;

  hasDraft: boolean;
  lastDraftSavedAt?: string;
};
