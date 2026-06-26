import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createDraftManager } from "../src/engine/draft-manager";
import type { DraftAdapter, DraftData } from "../src/types/adapters";

// ---- localStorage mock ----

const store = new Map<string, string>();

const localStorageMock = {
  getItem: vi.fn((key: string) => store.get(key) ?? null),
  setItem: vi.fn((key: string, value: string) => { store.set(key, value); }),
  removeItem: vi.fn((key: string) => { store.delete(key); }),
  clear: vi.fn(() => store.clear()),
  get length() { return store.size; },
  key: vi.fn((index: number) => [...store.keys()][index] ?? null),
};

beforeEach(() => {
  store.clear();
  vi.clearAllMocks();
  Object.defineProperty(globalThis, "localStorage", {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  // @ts-expect-error — cleaning up mock
  delete globalThis.localStorage;
});

// ---- helpers ----

function makeDraftAdapter(overrides?: Partial<DraftAdapter>): DraftAdapter {
  return {
    save: vi.fn(async () => {}),
    load: vi.fn(async () => null),
    delete: vi.fn(async () => {}),
    ...overrides,
  };
}

const BASE_CONFIG = {
  schemaId: "test-form",
  sessionToken: "sess-abc",
  storage: "local" as const,
  ttlHours: 72,
};

const SNAPSHOT = {
  values: { name: "Jane", email: "jane@example.com" },
  currentSectionId: "section-2",
  visitedSectionIds: ["section-1", "section-2"],
  savedAt: new Date().toISOString(),
};

// ---- tests ----

describe("createDraftManager", () => {
  describe("save", () => {
    it("saves a draft to localStorage with correct key format", async () => {
      const dm = createDraftManager(BASE_CONFIG);
      await dm.save(SNAPSHOT);

      const key = `fe_draft__test-form__sess-abc`;
      expect(localStorageMock.setItem).toHaveBeenCalledOnce();
      expect(localStorageMock.setItem.mock.calls[0][0]).toBe(key);

      const stored = JSON.parse(localStorageMock.setItem.mock.calls[0][1]) as DraftData;
      expect(stored.schemaId).toBe("test-form");
      expect(stored.sessionToken).toBe("sess-abc");
      expect(stored.partialData).toEqual(SNAPSHOT.values);
      expect(stored.currentSectionId).toBe("section-2");
      expect(stored.visitedSectionIds).toEqual(["section-1", "section-2"]);
      expect(stored.savedAt).toBeDefined();
      expect(stored.expiresAt).toBeDefined();
    });

    it("saves to server adapter when storage is 'server'", async () => {
      const adapter = makeDraftAdapter();
      const dm = createDraftManager({
        ...BASE_CONFIG,
        storage: "server",
        draftAdapter: adapter,
      });

      await dm.save(SNAPSHOT);

      expect(localStorageMock.setItem).not.toHaveBeenCalled();
      expect(adapter.save).toHaveBeenCalledOnce();
      const saved = (adapter.save as ReturnType<typeof vi.fn>).mock.calls[0][0] as DraftData;
      expect(saved.partialData).toEqual(SNAPSHOT.values);
    });

    it("saves to both localStorage and server when storage is 'both'", async () => {
      const adapter = makeDraftAdapter();
      const dm = createDraftManager({
        ...BASE_CONFIG,
        storage: "both",
        draftAdapter: adapter,
      });

      await dm.save(SNAPSHOT);

      expect(localStorageMock.setItem).toHaveBeenCalledOnce();
      expect(adapter.save).toHaveBeenCalledOnce();
    });

    it("calculates expiresAt based on ttlHours", async () => {
      const dm = createDraftManager({ ...BASE_CONFIG, ttlHours: 24 });
      await dm.save(SNAPSHOT);

      const stored = JSON.parse(localStorageMock.setItem.mock.calls[0][1]) as DraftData;
      const savedAt = new Date(stored.savedAt).getTime();
      const expiresAt = new Date(stored.expiresAt!).getTime();
      const diffHours = (expiresAt - savedAt) / (1000 * 60 * 60);
      expect(diffHours).toBe(24);
    });
  });

  describe("load", () => {
    it("loads a draft from localStorage and returns a snapshot", async () => {
      const dm = createDraftManager(BASE_CONFIG);
      await dm.save(SNAPSHOT);

      const loaded = await dm.load();
      expect(loaded).not.toBeNull();
      expect(loaded!.values).toEqual(SNAPSHOT.values);
      expect(loaded!.currentSectionId).toBe("section-2");
      expect(loaded!.visitedSectionIds).toEqual(["section-1", "section-2"]);
    });

    it("returns null when no draft exists", async () => {
      const dm = createDraftManager(BASE_CONFIG);
      const loaded = await dm.load();
      expect(loaded).toBeNull();
    });

    it("returns null and clears when draft is expired", async () => {
      const dm = createDraftManager({ ...BASE_CONFIG, ttlHours: 1 });

      // Save a draft that appears old
      const oldDate = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(); // 2 hours ago
      const key = `fe_draft__test-form__sess-abc`;
      const expiredData: DraftData = {
        schemaId: "test-form",
        sessionToken: "sess-abc",
        partialData: { name: "Old" },
        currentSectionId: "s1",
        visitedSectionIds: ["s1"],
        savedAt: oldDate,
        expiresAt: oldDate,
      };
      store.set(key, JSON.stringify(expiredData));

      const loaded = await dm.load();
      expect(loaded).toBeNull();
      // Should have cleared the expired draft
      expect(localStorageMock.removeItem).toHaveBeenCalled();
    });

    it("falls back to server adapter when localStorage has no draft", async () => {
      const serverData: DraftData = {
        schemaId: "test-form",
        sessionToken: "sess-abc",
        partialData: { name: "Server Draft" },
        currentSectionId: "s3",
        visitedSectionIds: ["s1", "s2", "s3"],
        savedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
      };
      const adapter = makeDraftAdapter({
        load: vi.fn(async () => serverData),
      });

      const dm = createDraftManager({
        ...BASE_CONFIG,
        storage: "both",
        draftAdapter: adapter,
      });

      const loaded = await dm.load();
      expect(loaded).not.toBeNull();
      expect(loaded!.values).toEqual({ name: "Server Draft" });
      expect(loaded!.currentSectionId).toBe("s3");
    });
  });

  describe("clear", () => {
    it("removes draft from localStorage", async () => {
      const dm = createDraftManager(BASE_CONFIG);
      await dm.save(SNAPSHOT);
      await dm.clear();

      expect(localStorageMock.removeItem).toHaveBeenCalled();
      const loaded = await dm.load();
      expect(loaded).toBeNull();
    });

    it("calls adapter.delete when storage is 'server'", async () => {
      const adapter = makeDraftAdapter();
      const dm = createDraftManager({
        ...BASE_CONFIG,
        storage: "server",
        draftAdapter: adapter,
      });

      await dm.clear();
      expect(adapter.delete).toHaveBeenCalledWith("test-form", "sess-abc");
    });

    it("clears both localStorage and server when storage is 'both'", async () => {
      const adapter = makeDraftAdapter();
      const dm = createDraftManager({
        ...BASE_CONFIG,
        storage: "both",
        draftAdapter: adapter,
      });

      await dm.save(SNAPSHOT);
      await dm.clear();

      expect(localStorageMock.removeItem).toHaveBeenCalled();
      expect(adapter.delete).toHaveBeenCalled();
    });
  });

  describe("hasDraft", () => {
    it("returns true when a valid draft exists in localStorage", async () => {
      const dm = createDraftManager(BASE_CONFIG);
      expect(dm.hasDraft()).toBe(false);

      await dm.save(SNAPSHOT);
      expect(dm.hasDraft()).toBe(true);
    });

    it("returns false when draft is expired", async () => {
      const dm = createDraftManager({ ...BASE_CONFIG, ttlHours: 1 });

      const key = `fe_draft__test-form__sess-abc`;
      const oldDate = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      store.set(key, JSON.stringify({
        schemaId: "test-form",
        sessionToken: "sess-abc",
        partialData: {},
        savedAt: oldDate,
        expiresAt: oldDate,
      }));

      expect(dm.hasDraft()).toBe(false);
    });

    it("returns false when localStorage is empty", () => {
      const dm = createDraftManager(BASE_CONFIG);
      expect(dm.hasDraft()).toBe(false);
    });
  });

  describe("multiple forms / isolation", () => {
    it("different schemaIds produce independent drafts", async () => {
      const dmA = createDraftManager({ ...BASE_CONFIG, schemaId: "form-a" });
      const dmB = createDraftManager({ ...BASE_CONFIG, schemaId: "form-b" });

      await dmA.save({ ...SNAPSHOT, values: { x: "a" } });
      await dmB.save({ ...SNAPSHOT, values: { x: "b" } });

      const loadedA = await dmA.load();
      const loadedB = await dmB.load();

      expect(loadedA!.values).toEqual({ x: "a" });
      expect(loadedB!.values).toEqual({ x: "b" });
    });

    it("different sessionTokens produce independent drafts", async () => {
      const dm1 = createDraftManager({ ...BASE_CONFIG, sessionToken: "tok-1" });
      const dm2 = createDraftManager({ ...BASE_CONFIG, sessionToken: "tok-2" });

      await dm1.save({ ...SNAPSHOT, values: { v: 1 } });
      await dm2.save({ ...SNAPSHOT, values: { v: 2 } });

      const loaded1 = await dm1.load();
      const loaded2 = await dm2.load();

      expect(loaded1!.values).toEqual({ v: 1 });
      expect(loaded2!.values).toEqual({ v: 2 });
    });
  });

  describe("SSR safety", () => {
    it("does not crash when localStorage is undefined", async () => {
      // @ts-expect-error — simulating SSR
      delete globalThis.localStorage;

      const dm = createDraftManager(BASE_CONFIG);

      // Should not throw
      await dm.save(SNAPSHOT);
      const loaded = await dm.load();
      expect(loaded).toBeNull();
      expect(dm.hasDraft()).toBe(false);
      await dm.clear(); // should not throw
    });
  });

  describe("data integrity", () => {
    it("preserves all value types through save/load cycle", async () => {
      const dm = createDraftManager(BASE_CONFIG);
      const complexValues = {
        string: "hello",
        number: 42,
        boolean: true,
        nullVal: null,
        array: [1, 2, 3],
        nested: { a: { b: "deep" } },
      };

      await dm.save({ ...SNAPSHOT, values: complexValues });
      const loaded = await dm.load();
      expect(loaded!.values).toEqual(complexValues);
    });
  });
});
