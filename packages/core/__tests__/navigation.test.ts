import { describe, it, expect } from "vitest";
import { createNavigation } from "../src/engine/navigation";
import type { FormEngineSchema } from "../src/types/schema";

function makeSchema(overrides?: Partial<FormEngineSchema>): FormEngineSchema {
  return {
    id: "test",
    version: "1.0.0",
    title: "Test",
    sections: [
      {
        id: "s1",
        title: "Section 1",
        questions: [{ id: "q1", type: "short_text", label: "Q1" }],
      },
      {
        id: "s2",
        title: "Section 2",
        questions: [{ id: "q2", type: "short_text", label: "Q2" }],
      },
      {
        id: "s3",
        title: "Section 3",
        questions: [{ id: "q3", type: "short_text", label: "Q3" }],
      },
    ],
    submitAction: { type: "callback" },
    ...overrides,
  } as FormEngineSchema;
}

describe("createNavigation", () => {
  describe("getVisibleSectionIds", () => {
    it("returns all sections when none have showIf", () => {
      const nav = createNavigation(makeSchema());
      expect(nav.getVisibleSectionIds({})).toEqual(["s1", "s2", "s3"]);
    });

    it("filters sections by showIf condition", () => {
      const nav = createNavigation(
        makeSchema({
          sections: [
            { id: "s1", title: "S1", questions: [{ id: "q1", type: "boolean", label: "Show?" }] },
            {
              id: "s2",
              title: "S2",
              showIf: { field: "q1", operator: "eq", value: true },
              questions: [{ id: "q2", type: "short_text", label: "Q2" }],
            },
            { id: "s3", title: "S3", questions: [{ id: "q3", type: "short_text", label: "Q3" }] },
          ],
        } as Partial<FormEngineSchema>),
      );

      expect(nav.getVisibleSectionIds({ q1: false })).toEqual(["s1", "s3"]);
      expect(nav.getVisibleSectionIds({ q1: true })).toEqual(["s1", "s2", "s3"]);
    });
  });

  describe("getInitialSectionId", () => {
    it("returns the first visible section", () => {
      const nav = createNavigation(makeSchema());
      expect(nav.getInitialSectionId({})).toBe("s1");
    });
  });

  describe("computeState", () => {
    it("computes correct state for first section", () => {
      const nav = createNavigation(makeSchema());
      nav.markVisited("s1");
      const navState = nav.computeState("s1", {});

      expect(navState.currentSectionId).toBe("s1");
      expect(navState.currentSectionIndex).toBe(0);
      expect(navState.canGoNext).toBe(true);
      expect(navState.canGoPrev).toBe(false);
      expect(navState.totalVisibleSections).toBe(3);
    });

    it("computes correct state for middle section", () => {
      const nav = createNavigation(makeSchema());
      nav.markVisited("s1");
      nav.markVisited("s2");
      const navState = nav.computeState("s2", {});

      expect(navState.currentSectionId).toBe("s2");
      expect(navState.currentSectionIndex).toBe(1);
      expect(navState.canGoNext).toBe(true);
      expect(navState.canGoPrev).toBe(true);
    });

    it("computes correct state for last section", () => {
      const nav = createNavigation(makeSchema());
      nav.markVisited("s3");
      const navState = nav.computeState("s3", {});

      expect(navState.currentSectionId).toBe("s3");
      expect(navState.currentSectionIndex).toBe(2);
      expect(navState.canGoNext).toBe(false);
      expect(navState.canGoPrev).toBe(true);
    });
  });

  describe("resolveNextSectionId", () => {
    it("returns next sequential section", () => {
      const nav = createNavigation(makeSchema());
      expect(nav.resolveNextSectionId("s1", {})).toBe("s2");
      expect(nav.resolveNextSectionId("s2", {})).toBe("s3");
    });

    it("returns null at last section", () => {
      const nav = createNavigation(makeSchema());
      expect(nav.resolveNextSectionId("s3", {})).toBeNull();
    });

    it("follows jump rules", () => {
      const nav = createNavigation(
        makeSchema({
          sections: [
            {
              id: "s1",
              title: "S1",
              questions: [{ id: "q1", type: "short_text", label: "Q1" }],
              onExit: {
                rules: [
                  { condition: { field: "q1", operator: "eq", value: "skip" }, jumpTo: "s3" },
                ],
              },
            },
            { id: "s2", title: "S2", questions: [{ id: "q2", type: "short_text", label: "Q2" }] },
            { id: "s3", title: "S3", questions: [{ id: "q3", type: "short_text", label: "Q3" }] },
          ],
        } as Partial<FormEngineSchema>),
      );

      expect(nav.resolveNextSectionId("s1", { q1: "skip" })).toBe("s3");
      expect(nav.resolveNextSectionId("s1", { q1: "normal" })).toBe("s2");
    });

    it("uses default jumpTo when no rules match", () => {
      const nav = createNavigation(
        makeSchema({
          sections: [
            {
              id: "s1",
              title: "S1",
              questions: [{ id: "q1", type: "short_text", label: "Q1" }],
              onExit: {
                rules: [
                  { condition: { field: "q1", operator: "eq", value: "skip" }, jumpTo: "s3" },
                ],
                default: "s2",
              },
            },
            { id: "s2", title: "S2", questions: [{ id: "q2", type: "short_text", label: "Q2" }] },
            { id: "s3", title: "S3", questions: [{ id: "q3", type: "short_text", label: "Q3" }] },
          ],
        } as Partial<FormEngineSchema>),
      );

      expect(nav.resolveNextSectionId("s1", { q1: "normal" })).toBe("s2");
    });
  });

  describe("resolvePrevSectionId", () => {
    it("returns previous visible section", () => {
      const nav = createNavigation(makeSchema());
      nav.markVisited("s1");
      nav.markVisited("s2");
      expect(nav.resolvePrevSectionId("s2", {})).toBe("s1");
    });

    it("returns null at first section", () => {
      const nav = createNavigation(makeSchema());
      nav.markVisited("s1");
      expect(nav.resolvePrevSectionId("s1", {})).toBeNull();
    });
  });

  describe("markVisited + progress", () => {
    it("tracks visited sections", () => {
      const nav = createNavigation(makeSchema());
      nav.markVisited("s1");
      nav.markVisited("s2");

      const navState = nav.computeState("s2", {});
      expect(navState.visitedSectionIds).toContain("s1");
      expect(navState.visitedSectionIds).toContain("s2");
    });

    it("does not duplicate visited sections", () => {
      const nav = createNavigation(makeSchema());
      nav.markVisited("s1");
      nav.markVisited("s1");

      const navState = nav.computeState("s1", {});
      expect(navState.visitedSectionIds.filter((id) => id === "s1")).toHaveLength(1);
    });
  });
});
