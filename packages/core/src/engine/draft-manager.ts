import type { DraftAdapter, DraftData } from "../types/adapters";

/**
 * Configuration for the draft manager factory.
 *
 * @property schemaId - Unique identifier for the form schema (used as part of the storage key)
 * @property sessionToken - Per-user/session token to isolate drafts between users
 * @property storage - Where to persist drafts: `"local"` (localStorage only),
 *   `"server"` (via DraftAdapter only), or `"both"` (localStorage + server)
 * @property ttlHours - How long a draft remains valid before automatic expiry
 * @property draftAdapter - Optional server-side adapter for remote draft storage.
 *   Required when `storage` is `"server"` or `"both"`.
 */
export type DraftManagerConfig = {
  schemaId: string;
  sessionToken: string;
  storage: "local" | "server" | "both";
  ttlHours: number;
  draftAdapter?: DraftAdapter;
  /** Auto-save interval in milliseconds. When set, `startAutoSave` will save at this interval. @since 1.4.0 */
  autoSaveIntervalMs?: number;
  /** Current schema version. Stored in snapshots for migration support. @since 1.4.0 */
  schemaVersion?: string;
};

/**
 * A point-in-time snapshot of form progress, used for saving and restoring drafts.
 */
export type DraftSnapshot = {
  values: Record<string, unknown>;
  currentSectionId: string;
  visitedSectionIds: string[];
  /** ISO 8601 timestamp of when the snapshot was saved. */
  savedAt: string;
  /** Schema version at the time the draft was saved. Used for migration detection. @since 1.4.0 */
  schemaVersion?: string;
};

/**
 * Creates a draft manager that handles save, load, clear, and existence
 * checks for form drafts. Supports localStorage, a server-side
 * `DraftAdapter`, or both simultaneously.
 *
 * Drafts are keyed by `schemaId + sessionToken` and automatically expire
 * after `ttlHours`. Expired drafts are cleared on load.
 *
 * @param config - Draft storage configuration
 * @returns An object with `save`, `load`, `clear`, and `hasDraft` methods
 *
 * @example
 * ```ts
 * const drafts = createDraftManager({
 *   schemaId: "contact-form",
 *   sessionToken: "user-abc",
 *   storage: "local",
 *   ttlHours: 24,
 * });
 *
 * await drafts.save({ values, currentSectionId, visitedSectionIds, savedAt });
 * const draft = await drafts.load();
 * ```
 */
export function createDraftManager(config: DraftManagerConfig) {
  const localKey = `fe_draft__${config.schemaId}__${config.sessionToken}`;
  let autoSaveTimer: ReturnType<typeof setInterval> | null = null;

  async function save(snapshot: DraftSnapshot): Promise<void> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + config.ttlHours * 60 * 60 * 1000);
    const data: DraftData = {
      schemaId: config.schemaId,
      sessionToken: config.sessionToken,
      partialData: snapshot.values,
      currentSectionId: snapshot.currentSectionId,
      visitedSectionIds: snapshot.visitedSectionIds,
      savedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      schemaVersion: config.schemaVersion,
    };

    if (config.storage === "local" || config.storage === "both") {
      saveToLocalStorage(localKey, data);
    }

    if ((config.storage === "server" || config.storage === "both") && config.draftAdapter) {
      await config.draftAdapter.save(data);
    }
  }

  async function load(
    migrations?: Record<string, (draft: DraftSnapshot) => DraftSnapshot>,
  ): Promise<DraftSnapshot | null> {
    let data: DraftData | null = null;

    // Try localStorage first
    if (config.storage === "local" || config.storage === "both") {
      data = loadFromLocalStorage(localKey);
    }

    // If not found locally, try server
    if (!data && (config.storage === "server" || config.storage === "both") && config.draftAdapter) {
      data = await config.draftAdapter.load(config.schemaId, config.sessionToken);
    }

    if (!data) return null;

    // Check TTL
    if (isExpired(data.savedAt, config.ttlHours)) {
      await clear();
      return null;
    }

    let snapshot: DraftSnapshot = {
      values: data.partialData,
      currentSectionId: data.currentSectionId ?? "",
      visitedSectionIds: data.visitedSectionIds ?? [],
      savedAt: data.savedAt,
      schemaVersion: data.schemaVersion,
    };

    // Schema version mismatch detection + migration
    const draftVersion = data.schemaVersion;
    if (config.schemaVersion && draftVersion && draftVersion !== config.schemaVersion) {
      if (migrations && migrations[draftVersion]) {
        snapshot = migrations[draftVersion](snapshot);
        snapshot.schemaVersion = config.schemaVersion;
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          `[FieldCraft] Draft was saved with schema v${draftVersion} but current schema is v${config.schemaVersion}. ` +
          `Data may be stale. Provide a migration for "${draftVersion}" to auto-fix.`,
        );
      }
    }

    return snapshot;
  }

  async function clear(): Promise<void> {
    if (config.storage === "local" || config.storage === "both") {
      removeFromLocalStorage(localKey);
    }

    if ((config.storage === "server" || config.storage === "both") && config.draftAdapter) {
      await config.draftAdapter.delete(config.schemaId, config.sessionToken);
    }
  }

  function hasDraft(): boolean {
    if (config.storage === "local" || config.storage === "both") {
      const data = loadFromLocalStorage(localKey);
      if (data && !isExpired(data.savedAt, config.ttlHours)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Starts auto-saving at the configured interval. Calls the provided `getSnapshot`
   * function on each tick to get the current form state.
   *
   * @param getSnapshot - Function that returns the current draft snapshot.
   * @since 1.4.0
   */
  function startAutoSave(getSnapshot: () => DraftSnapshot): void {
    if (!config.autoSaveIntervalMs || config.autoSaveIntervalMs <= 0) return;
    stopAutoSave();
    autoSaveTimer = setInterval(() => {
      save(getSnapshot()).catch(() => {
        // Silently ignore auto-save failures
      });
    }, config.autoSaveIntervalMs);
  }

  /**
   * Stops the auto-save interval timer.
   * @since 1.4.0
   */
  function stopAutoSave(): void {
    if (autoSaveTimer !== null) {
      clearInterval(autoSaveTimer);
      autoSaveTimer = null;
    }
  }

  return { save, load, clear, hasDraft, startAutoSave, stopAutoSave };
}

// ---- localStorage helpers ----

function saveToLocalStorage(key: string, data: DraftData): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Silently fail (quota exceeded, etc.)
  }
}

function loadFromLocalStorage(key: string): DraftData | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as DraftData;
  } catch {
    return null;
  }
}

function removeFromLocalStorage(key: string): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Silently fail
  }
}

// ---- TTL check ----

function isExpired(savedAt: string, ttlHours: number): boolean {
  const saved = new Date(savedAt).getTime();
  if (isNaN(saved)) return true;
  const now = Date.now();
  const ttlMs = ttlHours * 60 * 60 * 1000;
  return now - saved > ttlMs;
}
