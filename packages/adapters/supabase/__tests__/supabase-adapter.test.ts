import { describe, it, expect, vi } from "vitest";
import { createSupabaseAdapter } from "../src/supabase-adapter";
import { createSupabaseDraftAdapter } from "../src/supabase-draft-adapter";
import type { FormResponse, DraftData } from "@squaredr/formengine-core";

function createMockClient() {
  const mockFrom = vi.fn();
  const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
  const mockUpsert = vi.fn().mockResolvedValue({ data: null, error: null });
  const mockSelect = vi.fn();
  const mockDelete = vi.fn();
  const mockEq = vi.fn();
  const mockGt = vi.fn();
  const mockSingle = vi.fn();

  // Build chainable mock
  const filterBuilder = {
    eq: mockEq,
    gt: mockGt,
    single: mockSingle,
  };
  mockEq.mockReturnValue(filterBuilder);
  mockGt.mockReturnValue(filterBuilder);
  mockSingle.mockResolvedValue({ data: null, error: null });
  mockDelete.mockReturnValue(filterBuilder);
  mockSelect.mockReturnValue(filterBuilder);

  mockFrom.mockReturnValue({
    insert: mockInsert,
    upsert: mockUpsert,
    select: mockSelect,
    delete: mockDelete,
  });

  return {
    client: { from: mockFrom },
    mocks: {
      from: mockFrom,
      insert: mockInsert,
      upsert: mockUpsert,
      select: mockSelect,
      delete: mockDelete,
      eq: mockEq,
      gt: mockGt,
      single: mockSingle,
    },
  };
}

const mockResponse: FormResponse = {
  schemaId: "s1",
  schemaVersion: "1.0.0",
  submittedAt: new Date().toISOString(),
  sessionToken: "sess1",
  values: { name: "Alice", email: "alice@test.com" },
  metadata: { browser: "Chrome" },
  completionTimeMs: 5000,
};

describe("createSupabaseAdapter", () => {
  it("creates an adapter with name 'supabase'", () => {
    const { client } = createMockClient();
    const adapter = createSupabaseAdapter({ client });
    expect(adapter.name).toBe("supabase");
  });

  it("inserts response into default table", async () => {
    const { client, mocks } = createMockClient();
    const adapter = createSupabaseAdapter({ client });

    await adapter.submit(mockResponse);

    expect(mocks.from).toHaveBeenCalledWith("formengine_responses");
    expect(mocks.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        schema_id: "s1",
        session_token: "sess1",
        data: mockResponse.values,
      }),
    );
  });

  it("uses custom table name", async () => {
    const { client, mocks } = createMockClient();
    const adapter = createSupabaseAdapter({
      client,
      table: "my_responses",
    });

    await adapter.submit(mockResponse);
    expect(mocks.from).toHaveBeenCalledWith("my_responses");
  });

  it("calls onSuccess callback", async () => {
    const { client } = createMockClient();
    const onSuccess = vi.fn();
    const adapter = createSupabaseAdapter({ client, onSuccess });

    await adapter.submit(mockResponse);
    expect(onSuccess).toHaveBeenCalledWith(mockResponse, mockResponse.values);
  });

  it("throws and calls onError on Supabase error", async () => {
    const { client, mocks } = createMockClient();
    mocks.insert.mockResolvedValue({
      data: null,
      error: { message: "insert failed" },
    });
    const onError = vi.fn();
    const adapter = createSupabaseAdapter({ client, onError });

    await expect(adapter.submit(mockResponse)).rejects.toThrow(
      "Supabase insert failed",
    );
    expect(onError).toHaveBeenCalled();
  });
});

describe("createSupabaseDraftAdapter", () => {
  it("saves a draft via upsert", async () => {
    const { client, mocks } = createMockClient();
    const adapter = createSupabaseDraftAdapter({ client });

    const draft: DraftData = {
      schemaId: "s1",
      sessionToken: "sess1",
      partialData: { name: "Alice" },
      currentSectionId: "section-1",
      savedAt: new Date().toISOString(),
      expiresAt: new Date().toISOString(),
    };

    await adapter.save(draft);

    expect(mocks.from).toHaveBeenCalledWith("formengine_drafts");
    expect(mocks.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        schema_id: "s1",
        session_token: "sess1",
        partial_data: { name: "Alice" },
      }),
      { onConflict: "schema_id,session_token" },
    );
  });

  it("loads a draft", async () => {
    const { client, mocks } = createMockClient();
    mocks.single.mockResolvedValue({
      data: {
        schema_id: "s1",
        session_token: "sess1",
        partial_data: { name: "Alice" },
        current_section_id: "section-1",
        visited_section_ids: ["section-1"],
        updated_at: "2026-01-01T00:00:00Z",
        expires_at: "2026-04-01T00:00:00Z",
      },
      error: null,
    });

    const adapter = createSupabaseDraftAdapter({ client });
    const result = await adapter.load("s1", "sess1");

    expect(result).toEqual({
      schemaId: "s1",
      sessionToken: "sess1",
      partialData: { name: "Alice" },
      currentSectionId: "section-1",
      visitedSectionIds: ["section-1"],
      savedAt: "2026-01-01T00:00:00Z",
      expiresAt: "2026-04-01T00:00:00Z",
    });
  });

  it("returns null when draft not found", async () => {
    const { client, mocks } = createMockClient();
    mocks.single.mockResolvedValue({ data: null, error: null });

    const adapter = createSupabaseDraftAdapter({ client });
    const result = await adapter.load("s1", "sess-none");

    expect(result).toBeNull();
  });

  it("deletes a draft", async () => {
    const { client, mocks } = createMockClient();
    const adapter = createSupabaseDraftAdapter({ client });

    await adapter.delete("s1", "sess1");

    expect(mocks.from).toHaveBeenCalledWith("formengine_drafts");
    expect(mocks.delete).toHaveBeenCalled();
    expect(mocks.eq).toHaveBeenCalledWith("schema_id", "s1");
    expect(mocks.eq).toHaveBeenCalledWith("session_token", "sess1");
  });
});
