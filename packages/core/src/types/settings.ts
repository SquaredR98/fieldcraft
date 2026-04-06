export type FormSettings = {
  displayMode?: "classic" | "stepped" | "conversational";
  allowDraftSave?: boolean;
  draftStorage?: "local" | "server" | "both";
  draftTtlHours?: number;
  showProgress?: boolean;
  progressStyle?: "bar" | "steps" | "percentage";
  prefill?: PrefillConfig;
  noPiiInLogs?: boolean;
  locale?: string;
  serverUrl?: string;
  submitButton?: {
    label?: string;
    loadingLabel?: string;
    successLabel?: string;
  };
  navigation?: {
    showBack?: boolean;
    showSectionList?: boolean;
    nextLabel?: string;
    backLabel?: string;
    allowSkip?: boolean;
  };
};

export type PrefillConfig = {
  source: "props" | "url" | "both";
  paramPrefix?: string;
  transform?: (raw: Record<string, string>) => Record<string, unknown>;
};
