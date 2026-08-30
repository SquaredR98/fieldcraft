import type { FormEngineSchema } from "../types/schema";
import type { EngineOptions } from "./create-engine";

// ---- Types ----

export type TelemetryEvent = {
  // Schema metadata (anonymized — no content)
  schemaId: string;
  fieldCount: number;
  sectionCount: number;
  fieldTypes: Record<string, number>;

  // Feature flags
  usesConditions: boolean;
  usesComputed: boolean;
  usesDrafts: boolean;
  usesScoring: boolean;
  usesAdapters: boolean;
  usesPrefill: boolean;

  // Environment
  coreVersion: string;
  nodeVersion: string;
  runtime: "node" | "browser" | "edge" | "unknown";

  // Schema validation
  schemaValid: boolean;

  // Timestamp
  timestamp: string;
};

// ---- Constants ----

const TELEMETRY_ENDPOINT = "https://fieldcraft.squaredr.tech/api/telemetry";
const RATE_LIMIT_MS = 24 * 60 * 60 * 1000; // 24 hours
const CORE_VERSION = "1.3.14";

// In-memory rate limit: schemaId hash → last sent timestamp
const sentEvents = new Map<string, number>();

// ---- Helpers ----

function detectRuntime(): TelemetryEvent["runtime"] {
  try {
    // Edge runtime (Cloudflare Workers, Vercel Edge, Deno Deploy)
    if (typeof globalThis !== "undefined" && typeof (globalThis as any).EdgeRuntime !== "undefined") {
      return "edge";
    }
    // Node.js
    if (typeof process !== "undefined" && process.versions?.node) {
      return "node";
    }
    // Browser
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      return "browser";
    }
  } catch {
    // Swallow — some environments throw on property access
  }
  return "unknown";
}

function getNodeVersion(): string {
  try {
    if (typeof process !== "undefined" && process.versions?.node) {
      return process.versions.node;
    }
  } catch {
    // Swallow
  }
  return "unknown";
}

/**
 * Simple non-cryptographic hash for anonymizing schema IDs.
 * We don't need crypto-grade hashing — just consistent anonymization.
 */
function hashSchemaId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return "fc_" + Math.abs(hash).toString(36);
}

// ---- Public API ----

/**
 * Check whether telemetry is enabled.
 *
 * Telemetry is opt-in. It is enabled when:
 * 1. `options.telemetry` is explicitly `true`, OR
 * 2. The `FIELDCRAFT_TELEMETRY_ENABLED` env var is set to `"true"` or `"1"`
 *
 * If `options.telemetry` is explicitly `false`, telemetry is always disabled
 * regardless of the env var.
 */
export function isTelemetryEnabled(optionsTelemetry?: boolean): boolean {
  // Explicit option takes precedence
  if (optionsTelemetry === false) return false;
  if (optionsTelemetry === true) return true;

  // Fall back to env var
  try {
    if (typeof process !== "undefined" && process.env) {
      const envVal = process.env.FIELDCRAFT_TELEMETRY_ENABLED;
      return envVal === "true" || envVal === "1";
    }
  } catch {
    // Swallow — some environments throw on process access
  }
  return false;
}

/**
 * Check whether telemetry debug mode is active.
 * When active, events are printed to console instead of sent.
 */
function isTelemetryDebug(): boolean {
  try {
    if (typeof process !== "undefined" && process.env) {
      const envVal = process.env.FIELDCRAFT_TELEMETRY_DEBUG;
      return envVal === "true" || envVal === "1";
    }
  } catch {
    // Swallow
  }
  return false;
}

/**
 * Collect telemetry data from a schema and engine options.
 * No PII, no field values, no schema content — only structural metadata.
 */
export function collectTelemetryData(
  schema: FormEngineSchema,
  options?: EngineOptions,
  schemaValid = true,
): TelemetryEvent {
  const allQuestions = schema.sections.flatMap((s) => s.questions);

  // Count field types
  const fieldTypes: Record<string, number> = {};
  for (const q of allQuestions) {
    fieldTypes[q.type] = (fieldTypes[q.type] || 0) + 1;
  }

  // Detect feature usage
  const usesConditions = allQuestions.some((q) => q.showIf != null) ||
    schema.sections.some((s) => s.showIf != null);
  const usesComputed = allQuestions.some((q) => q.type === "calculated");
  const usesDrafts = schema.settings?.allowDraftSave === true || (schema.settings as Record<string, unknown> | undefined)?.enableDraftSaving === true;
  const usesScoring = allQuestions.some((q) => q.type === "scoring" || (q as unknown as { score?: unknown }).score != null);
  const usesAdapters = options?.adapters != null;
  const usesPrefill = schema.settings?.prefill != null || options?.prefillValues != null;

  return {
    schemaId: hashSchemaId(schema.id),
    fieldCount: allQuestions.length,
    sectionCount: schema.sections.length,
    fieldTypes,
    usesConditions,
    usesComputed,
    usesDrafts,
    usesScoring,
    usesAdapters,
    usesPrefill,
    coreVersion: CORE_VERSION,
    nodeVersion: getNodeVersion(),
    runtime: detectRuntime(),
    schemaValid,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Send a telemetry event. Non-blocking, fire-and-forget.
 * Rate-limited to 1 event per schema ID per 24 hours.
 * In debug mode, prints to console instead of sending.
 * Never throws.
 */
export function sendTelemetryEvent(event: TelemetryEvent): void {
  try {
    // Rate limit: skip if we sent for this schemaId within 24h
    const lastSent = sentEvents.get(event.schemaId);
    if (lastSent && Date.now() - lastSent < RATE_LIMIT_MS) {
      return;
    }

    // Debug mode: print instead of send
    if (isTelemetryDebug()) {
      console.log("[FieldCraft Telemetry — Debug Mode]", JSON.stringify(event, null, 2));
      sentEvents.set(event.schemaId, Date.now());
      return;
    }

    // Fire-and-forget POST
    sentEvents.set(event.schemaId, Date.now());

    // Use globalThis.fetch for cross-environment compatibility
    const fetchFn = typeof globalThis !== "undefined" && typeof globalThis.fetch === "function"
      ? globalThis.fetch
      : typeof fetch === "function"
        ? fetch
        : null;

    if (!fetchFn) return;

    fetchFn(TELEMETRY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    }).catch(() => {
      // Silently ignore — telemetry must never break the user's app
    });
  } catch {
    // Silently ignore all errors
  }
}
