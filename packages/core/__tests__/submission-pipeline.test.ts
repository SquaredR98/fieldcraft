import { describe, it, expect, vi } from "vitest";
import { runSubmission } from "../src/engine/submission-pipeline";
import type { FormResponse } from "../src/types/response";
import type { SubmitAdapter } from "../src/types/adapters";

function makeResponse(overrides?: Partial<FormResponse>): FormResponse {
  return {
    schemaId: "test-form",
    schemaVersion: "1.0.0",
    submittedAt: "2025-01-01T00:00:00Z",
    sessionToken: "tok-123",
    values: { name: "Jane" },
    ...overrides,
  };
}

function makeAdapter(
  name: string,
  behavior: "success" | "fail" | (() => Promise<void>) = "success",
): SubmitAdapter {
  const onError = vi.fn();
  const submit = vi.fn(async () => {
    if (behavior === "fail") throw new Error(`${name} failed`);
    if (typeof behavior === "function") return behavior();
  });
  return { name, submit, onError };
}

describe("runSubmission", () => {
  describe("onSubmit callback override", () => {
    it("uses onSubmit callback when provided, skipping adapters", async () => {
      const adapter = makeAdapter("http");
      const onSubmit = vi.fn();
      const response = makeResponse();

      const result = await runSubmission(response, [adapter], onSubmit);

      expect(result.success).toBe(true);
      expect(result.adapterResults).toHaveLength(1);
      expect(result.adapterResults[0].adapterName).toBe("onSubmit");
      expect(onSubmit).toHaveBeenCalledWith(response);
      expect(adapter.submit).not.toHaveBeenCalled();
    });

    it("reports failure when onSubmit throws", async () => {
      const onSubmit = vi.fn().mockRejectedValue(new Error("Callback boom"));
      const response = makeResponse();

      const result = await runSubmission(response, [], onSubmit);

      expect(result.success).toBe(false);
      expect(result.adapterResults[0].error).toBe("Callback boom");
    });

    it("handles non-Error throw from onSubmit", async () => {
      const onSubmit = vi.fn().mockRejectedValue("string error");
      const response = makeResponse();

      const result = await runSubmission(response, [], onSubmit);

      expect(result.success).toBe(false);
      expect(result.adapterResults[0].error).toBe("Submission callback failed");
    });

    it("works with async onSubmit", async () => {
      const onSubmit = vi.fn(async () => {
        await new Promise((r) => setTimeout(r, 10));
      });
      const response = makeResponse();

      const result = await runSubmission(response, [], onSubmit);

      expect(result.success).toBe(true);
    });
  });

  describe("no adapters", () => {
    it("returns success with empty results when no adapters configured", async () => {
      const response = makeResponse();
      const result = await runSubmission(response, []);

      expect(result.success).toBe(true);
      expect(result.adapterResults).toEqual([]);
    });
  });

  describe("single adapter", () => {
    it("returns success when adapter succeeds", async () => {
      const adapter = makeAdapter("http-api");
      const response = makeResponse();

      const result = await runSubmission(response, [adapter]);

      expect(result.success).toBe(true);
      expect(result.adapterResults).toHaveLength(1);
      expect(result.adapterResults[0]).toEqual({
        adapterName: "http-api",
        success: true,
      });
      expect(adapter.submit).toHaveBeenCalledWith(response);
    });

    it("returns failure when adapter throws", async () => {
      const adapter = makeAdapter("http-api", "fail");
      const response = makeResponse();

      const result = await runSubmission(response, [adapter]);

      expect(result.success).toBe(false);
      expect(result.adapterResults[0]).toEqual({
        adapterName: "http-api",
        success: false,
        error: "http-api failed",
      });
    });

    it("calls onError when adapter throws", async () => {
      const adapter = makeAdapter("http-api", "fail");
      const response = makeResponse();

      await runSubmission(response, [adapter]);

      expect(adapter.onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("multiple adapters (adapter chaining)", () => {
    it("runs all adapters concurrently", async () => {
      const callOrder: string[] = [];
      const adapter1 = makeAdapter("a1", async () => {
        await new Promise((r) => setTimeout(r, 20));
        callOrder.push("a1");
      });
      const adapter2 = makeAdapter("a2", async () => {
        callOrder.push("a2");
      });
      const response = makeResponse();

      await runSubmission(response, [adapter1, adapter2]);

      // a2 should resolve first since a1 has a delay
      expect(callOrder).toEqual(["a2", "a1"]);
    });

    it("returns success when all adapters succeed", async () => {
      const adapter1 = makeAdapter("a1");
      const adapter2 = makeAdapter("a2");
      const response = makeResponse();

      const result = await runSubmission(response, [adapter1, adapter2]);

      expect(result.success).toBe(true);
      expect(result.adapterResults).toHaveLength(2);
      expect(result.adapterResults[0].success).toBe(true);
      expect(result.adapterResults[1].success).toBe(true);
    });

    it("returns failure if any adapter fails (partial failure)", async () => {
      const adapter1 = makeAdapter("a1");
      const adapter2 = makeAdapter("a2", "fail");
      const adapter3 = makeAdapter("a3");
      const response = makeResponse();

      const result = await runSubmission(response, [adapter1, adapter2, adapter3]);

      expect(result.success).toBe(false);
      expect(result.adapterResults[0].success).toBe(true);
      expect(result.adapterResults[1].success).toBe(false);
      expect(result.adapterResults[1].error).toBe("a2 failed");
      expect(result.adapterResults[2].success).toBe(true);
    });

    it("does not stop other adapters when one fails", async () => {
      const adapter1 = makeAdapter("a1", "fail");
      const adapter2 = makeAdapter("a2");
      const response = makeResponse();

      const result = await runSubmission(response, [adapter1, adapter2]);

      expect(adapter1.submit).toHaveBeenCalled();
      expect(adapter2.submit).toHaveBeenCalled();
      expect(result.adapterResults[1].success).toBe(true);
    });

    it("calls onError only for failed adapters", async () => {
      const adapter1 = makeAdapter("a1");
      const adapter2 = makeAdapter("a2", "fail");
      const response = makeResponse();

      await runSubmission(response, [adapter1, adapter2]);

      expect(adapter1.onError).not.toHaveBeenCalled();
      expect(adapter2.onError).toHaveBeenCalled();
    });

    it("handles all adapters failing", async () => {
      const adapter1 = makeAdapter("a1", "fail");
      const adapter2 = makeAdapter("a2", "fail");
      const response = makeResponse();

      const result = await runSubmission(response, [adapter1, adapter2]);

      expect(result.success).toBe(false);
      expect(result.adapterResults.every((r) => !r.success)).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("handles adapter that throws non-Error", async () => {
      const adapter: SubmitAdapter = {
        name: "bad-adapter",
        submit: vi.fn(async () => {
          throw "string error";
        }),
      };
      const response = makeResponse();

      const result = await runSubmission(response, [adapter]);

      expect(result.success).toBe(false);
      expect(result.adapterResults[0].error).toBe("Unknown error");
    });

    it("passes the full response to each adapter", async () => {
      const adapter1 = makeAdapter("a1");
      const adapter2 = makeAdapter("a2");
      const response = makeResponse({ values: { q1: "answer1", q2: 42 } });

      await runSubmission(response, [adapter1, adapter2]);

      expect(adapter1.submit).toHaveBeenCalledWith(response);
      expect(adapter2.submit).toHaveBeenCalledWith(response);
    });
  });
});
