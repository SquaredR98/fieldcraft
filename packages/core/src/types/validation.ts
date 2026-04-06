export type ValidationRule =
  | { type: "required"; message?: string }
  | { type: "min"; value: number; message?: string }
  | { type: "max"; value: number; message?: string }
  | { type: "minLength"; value: number; message?: string }
  | { type: "maxLength"; value: number; message?: string }
  | { type: "pattern"; regex: string; flags?: string; message?: string }
  | { type: "email"; message?: string }
  | { type: "phone"; message?: string }
  | { type: "url"; message?: string }
  | { type: "date"; min?: string; max?: string; message?: string }
  | { type: "fileSize"; maxMb: number; message?: string }
  | { type: "fileType"; accept: string[]; message?: string }
  | { type: "custom"; name: string; params?: Record<string, unknown>; message?: string }
  | { type: "async"; endpoint: string; debounceMs?: number; message?: string };

export type CustomValidator = (
  value: unknown,
  values: Record<string, unknown>,
  params?: Record<string, unknown>,
) => string | null;

export type AsyncValidator = (
  value: unknown,
  params?: Record<string, unknown>,
) => Promise<string | null>;
