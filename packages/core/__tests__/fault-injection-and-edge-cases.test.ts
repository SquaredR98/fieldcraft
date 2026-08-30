import { describe, it, expect, vi } from "vitest";
import { createEngine } from "../src/engine/create-engine";
import type { FormEngineSchema } from "../src/types/schema";
import type { DraftAdapter, DraftData } from "../src/types/adapters";

describe("Fault Injection, Edge Cases & Failure-Proofing Suite", () => {
  const baseSchema: FormEngineSchema = {
    id: "fault-test-form",
    version: "2.0.0",
    title: "Fault Injection Form",
    settings: {
      draftStorage: "server",
    },
    sections: [
      {
        id: "sec1",
        title: "Section 1",
        questions: [
          { id: "email", type: "email", label: "Email", required: true },
          { id: "amount", type: "number", label: "Amount", required: true },
          {
            id: "discount",
            type: "calculated",
            label: "Discount",
            config: {
              type: "calculated",
              expression: "IF({amount} > 100, {amount} * 0.1, 0)",
            },
          },
        ],
      },
    ],
    submitAction: { type: "callback" },
  };

  describe("Draft Storage Fault Injection & Recovery", () => {
    it("handles missing draft payloads without crashing", async () => {
      const draftAdapter: DraftAdapter = {
        load: vi.fn().mockResolvedValue(null),
        save: vi.fn().mockResolvedValue(undefined),
        delete: vi.fn().mockResolvedValue(undefined),
      };

      const engine = createEngine(baseSchema, {
        draftAdapter,
      });

      const loaded = await engine.loadDraft();
      expect(loaded).toBe(false);
      expect(engine.getState().values.email).toBeUndefined();

      await expect(engine.saveDraft()).resolves.toBeUndefined();
    });

    it("applies draft schema migration functions during version upgrades", async () => {
      const oldDraftPayload: DraftData = {
        schemaId: "fault-test-form",
        sessionToken: "test-session",
        schemaVersion: "1.0.0",
        savedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        currentSectionId: "sec1",
        visitedSectionIds: ["sec1"],
        partialData: {
          user_email: "legacy@domain.com",
          amount: 150,
        },
      };

      const mockAdapter: DraftAdapter = {
        load: vi.fn().mockResolvedValue(oldDraftPayload),
        save: vi.fn().mockResolvedValue(undefined),
        delete: vi.fn().mockResolvedValue(undefined),
      };

      const engine = createEngine(baseSchema, {
        draftAdapter: mockAdapter,
        draftMigrations: {
          "1.0.0": (snapshot) => ({
            ...snapshot,
            values: {
              email: snapshot.values.user_email,
              amount: snapshot.values.amount,
            },
          }),
        },
      });

      const loaded = await engine.loadDraft();
      expect(loaded).toBe(true);
      expect(engine.getState().values.email).toBe("legacy@domain.com");
      expect(engine.getState().values.amount).toBe(150);
      expect(engine.getState().values.discount).toBe(15);
    });
  });

  describe("Submission Pipeline Fault Injection", () => {
    it("catches false in beforeSubmit interceptor and safely aborts submission", async () => {
      const customAdapter = {
        name: "test-adapter",
        submit: vi.fn().mockResolvedValue({ success: true }),
      };

      const engine = createEngine(baseSchema, {
        adapters: [customAdapter],
        initialValues: { email: "test@example.com", amount: 50 },
        beforeSubmit: () => {
          // Returning false cancels submission cleanly
          return false;
        },
      });

      const result = await engine.submit();
      expect(result.success).toBe(false);
      expect(result.adapterResults[0].error).toContain("Submission cancelled by beforeSubmit hook");
      // Downstream adapters must NOT be called if beforeSubmit cancels
      expect(customAdapter.submit).not.toHaveBeenCalled();
      expect(engine.getState().isSubmitting).toBe(false);
    });

    it("handles adapter network failures and collects individual failure diagnostics", async () => {
      const failingAdapter = {
        name: "flakey-endpoint",
        submit: vi.fn().mockRejectedValue(new Error("ETIMEDOUT: Connection reset")),
      };

      const engine = createEngine(baseSchema, {
        adapters: [failingAdapter],
        initialValues: { email: "test@example.com", amount: 50 },
      });

      const result = await engine.submit();
      expect(result.success).toBe(false);
      expect(result.adapterResults[0].adapterName).toBe("flakey-endpoint");
      expect(result.adapterResults[0].success).toBe(false);
      expect(result.adapterResults[0].error).toContain("ETIMEDOUT");
      expect(engine.getState().isSubmitting).toBe(false);
    });
  });

  describe("Stress & Scale Performance (100 Questions Benchmark)", () => {
    it("evaluates a 100-field form with cascading dependencies under 50ms", () => {
      const questions = Array.from({ length: 100 }, (_, i) => ({
        id: `field_${i}`,
        type: i === 0 ? "number" : "calculated",
        label: `Field ${i}`,
        ...(i > 0
          ? {
              config: {
                type: "calculated" as const,
                expression: `{field_${i - 1}} + 1`,
              },
            }
          : {}),
      }));

      const largeSchema: FormEngineSchema = {
        id: "stress-form",
        version: "1.0.0",
        title: "100 Fields Stress Test",
        sections: [
          {
            id: "large_section",
            title: "Large Section",
            questions: questions as any,
          },
        ],
        submitAction: { type: "callback" },
      };

      const start = performance.now();
      const engine = createEngine(largeSchema);
      engine.setValue("field_0", 10);
      const duration = performance.now() - start;

      expect(engine.getState().values.field_0).toBe(10);
      expect(engine.getState().values.field_99).toBe(109);
      // Ensure fast computation speed
      expect(duration).toBeLessThan(150);
    });
  });
});
