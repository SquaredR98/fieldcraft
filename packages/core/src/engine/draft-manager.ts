import type { DraftAdapter, DraftData } from "../types/adapters";

export type DraftManagerConfig = {
  schemaId: string;
  sessionToken: string;
  storage: "local" | "server" | "both";
  ttlHours: number;
  draftAdapter?: DraftAdapter;
};

export type DraftSnapshot = {
  values: Record<string, unknown>;
  currentSectionId: string;
  visitedSectionIds: string[];
  savedAt: string; // ISO 8601
};

/**
 * Manages draft save/load/clear operations.
 * Supports localStorage and/or a server-side DraftAdapter.
 */
export function createDraftManager(config: DraftManagerConfig) {
  const localKey = `fe_draft__${config.schemaId}__${config.sessionToken}`;

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
    };

    if (config.storage === "local" || config.storage === "both") {
      saveToLocalStorage(localKey, data);
    }

    if ((config.storage === "server" || config.storage === "both") && config.draftAdapter) {
      await config.draftAdapter.save(data);
    }
  }

  async function load(): Promise<DraftSnapshot | null> {
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

    return {
      values: data.partialData,
      currentSectionId: data.currentSectionId ?? "",
      visitedSectionIds: data.visitedSectionIds ?? [],
      savedAt: data.savedAt,
    };
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

  return { save, load, clear, hasDraft };
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
