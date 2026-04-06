import type { FormResponse } from "@squaredr/formengine-core";

export type PostgresAdapterConfig = {
  /** PostgreSQL connection URL */
  connectionString: string;
  /** Table name for responses (default: "formengine_responses") */
  table?: string;
  /** Field IDs to encrypt at rest */
  encryptFields?: string[];
  /** Base64-encoded 32-byte encryption key */
  encryptionKey?: string;
  /** Enable SSL (default: true in production) */
  ssl?: boolean;
  /** Called after successful insert */
  onSuccess?: (response: FormResponse) => void;
  /** Called on error */
  onError?: (error: Error) => void;
};

export type PostgresDraftAdapterConfig = {
  /** PostgreSQL connection URL */
  connectionString: string;
  /** Table name for drafts (default: "formengine_drafts") */
  table?: string;
  /** Draft time-to-live in hours (default: 72) */
  ttlHours?: number;
  /** Enable SSL */
  ssl?: boolean;
};
