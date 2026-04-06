export type FormResponse = {
  schemaId: string;
  schemaVersion: string;
  submittedAt: string;
  sessionToken: string;
  values: Record<string, unknown>;
  scores?: Record<string, number>;
  totalScore?: number;
  metadata?: Record<string, unknown>;
  completionTimeMs?: number;
};

export type SubmitResult = {
  success: boolean;
  adapterResults: {
    adapterName: string;
    success: boolean;
    error?: string;
  }[];
};
