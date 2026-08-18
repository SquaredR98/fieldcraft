import { describe, it, expect } from "vitest";
import { createNavigation } from "../src/engine/navigation";
import type { VisibleQuestion } from "../src/engine/navigation";
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

  // ── Question-level navigation ──

  describe("getVisibleQuestions", () => {
    it("returns all input questions across all sections", () => {
      const nav = createNavigation(makeSchema());
      const questions = nav.getVisibleQuestions({});

      expect(questions).toHaveLength(3);
      expect(questions[0].question.id).toBe("q1");
      expect(questions[0].sectionId).toBe("s1");
      expect(questions[0].globalIndex).toBe(0);
      expect(questions[1].question.id).toBe("q2");
      expect(questions[1].sectionId).toBe("s2");
      expect(questions[1].globalIndex).toBe(1);
      expect(questions[2].question.id).toBe("q3");
      expect(questions[2].sectionId).toBe("s3");
      expect(questions[2].globalIndex).toBe(2);
    });

    it("excludes structural fields", () => {
      const nav = createNavigation(
        makeSchema({
          sections: [
            {
              id: "s1",
              title: "S1",
              questions: [
                { id: "h1", type: "section_header", label: "Header" },
                { id: "q1", type: "short_text", label: "Q1" },
                { id: "d1", type: "divider", label: "" },
                { id: "q2", type: "email", label: "Email" },
                { id: "ib1", type: "info_block", label: "Info" },
              ],
            },
          ],
        } as Partial<FormEngineSchema>),
      );

      const questions = nav.getVisibleQuestions({});
      expect(questions).toHaveLength(2);
      expect(questions[0].question.id).toBe("q1");
      expect(questions[1].question.id).toBe("q2");
    });

    it("excludes all non-input types", () => {
      const nav = createNavigation(
        makeSchema({
          sections: [
            {
              id: "s1",
              title: "S1",
              questions: [
                { id: "ws", type: "welcome-screen", label: "Welcome" },
                { id: "ts", type: "thank-you-screen", label: "Thanks" },
                { id: "rt", type: "rich-text", label: "Rich" },
                { id: "im", type: "image", label: "Image" },
                { id: "vi", type: "video", label: "Video" },
                { id: "dv", type: "divider", label: "" },
                { id: "sp", type: "spacer", label: "" },
                { id: "pb", type: "page_break", label: "" },
                { id: "q1", type: "short_text", label: "Name" },
              ],
            },
          ],
        } as Partial<FormEngineSchema>),
      );

      const questions = nav.getVisibleQuestions({});
      expect(questions).toHaveLength(1);
      expect(questions[0].question.id).toBe("q1");
    });

    it("excludes questions hidden by showIf", () => {
      const nav = createNavigation(
        makeSchema({
          sections: [
            {
              id: "s1",
              title: "S1",
              questions: [
                { id: "q1", type: "boolean", label: "Toggle" },
                {
                  id: "q2",
                  type: "short_text",
                  label: "Conditional",
                  showIf: { field: "q1", operator: "eq", value: true },
                },
              ],
            },
          ],
        } as Partial<FormEngineSchema>),
      );

      expect(nav.getVisibleQuestions({ q1: false })).toHaveLength(1);
      expect(nav.getVisibleQuestions({ q1: true })).toHaveLength(2);
    });

    it("excludes questions in hidden sections", () => {
      const nav = createNavigation(
        makeSchema({
          sections: [
            {
              id: "s1",
              title: "S1",
              questions: [{ id: "q1", type: "boolean", label: "Show S2?" }],
            },
            {
              id: "s2",
              title: "S2",
              showIf: { field: "q1", operator: "eq", value: true },
              questions: [{ id: "q2", type: "short_text", label: "Q2" }],
            },
          ],
        } as Partial<FormEngineSchema>),
      );

      expect(nav.getVisibleQuestions({ q1: false })).toHaveLength(1);
      expect(nav.getVisibleQuestions({ q1: true })).toHaveLength(2);
    });
  });

  describe("computeQuestionState", () => {
    it("computes state for the first question", () => {
      const nav = createNavigation(makeSchema());
      const qs = nav.computeQuestionState("q1", {});

      expect(qs.currentQuestionId).toBe("q1");
      expect(qs.currentQuestionIndex).toBe(0);
      expect(qs.totalVisibleQuestions).toBe(3);
      expect(qs.canGoNextQuestion).toBe(true);
      expect(qs.canGoPrevQuestion).toBe(false);
      expect(qs.questionProgressPercent).toBe(33);
    });

    it("computes state for a middle question", () => {
      const nav = createNavigation(makeSchema());
      const qs = nav.computeQuestionState("q2", {});

      expect(qs.currentQuestionId).toBe("q2");
      expect(qs.currentQuestionIndex).toBe(1);
      expect(qs.canGoNextQuestion).toBe(true);
      expect(qs.canGoPrevQuestion).toBe(true);
      expect(qs.questionProgressPercent).toBe(67);
    });

    it("computes state for the last question", () => {
      const nav = createNavigation(makeSchema());
      const qs = nav.computeQuestionState("q3", {});

      expect(qs.currentQuestionId).toBe("q3");
      expect(qs.currentQuestionIndex).toBe(2);
      expect(qs.canGoNextQuestion).toBe(false);
      expect(qs.canGoPrevQuestion).toBe(true);
      expect(qs.questionProgressPercent).toBe(100);
    });

    it("snaps to first question when current is invalid", () => {
      const nav = createNavigation(makeSchema());
      const qs = nav.computeQuestionState("nonexistent", {});

      expect(qs.currentQuestionId).toBe("q1");
      expect(qs.currentQuestionIndex).toBe(0);
    });

    it("handles empty schema gracefully", () => {
      const nav = createNavigation(
        makeSchema({
          sections: [{ id: "s1", title: "S1", questions: [] }],
        } as Partial<FormEngineSchema>),
      );
      const qs = nav.computeQuestionState("", {});

      expect(qs.currentQuestionId).toBe("");
      expect(qs.totalVisibleQuestions).toBe(0);
      expect(qs.canGoNextQuestion).toBe(false);
      expect(qs.canGoPrevQuestion).toBe(false);
      expect(qs.questionProgressPercent).toBe(0);
    });
  });

  describe("resolveNextQuestionId", () => {
    it("returns the next question in the same section", () => {
      const nav = createNavigation(
        makeSchema({
          sections: [
            {
              id: "s1",
              title: "S1",
              questions: [
                { id: "q1", type: "short_text", label: "Q1" },
                { id: "q2", type: "short_text", label: "Q2" },
              ],
            },
          ],
        } as Partial<FormEngineSchema>),
      );

      const next = nav.resolveNextQuestionId("q1", {});
      expect(next).not.toBeNull();
      expect(next!.question.id).toBe("q2");
      expect(next!.sectionId).toBe("s1");
    });

    it("crosses section boundaries", () => {
      const nav = createNavigation(makeSchema());
      const next = nav.resolveNextQuestionId("q1", {});
      expect(next).not.toBeNull();
      expect(next!.question.id).toBe("q2");
      expect(next!.sectionId).toBe("s2");
    });

    it("returns null at the last question", () => {
      const nav = createNavigation(makeSchema());
      expect(nav.resolveNextQuestionId("q3", {})).toBeNull();
    });

    it("skips structural fields when resolving next", () => {
      const nav = createNavigation(
        makeSchema({
          sections: [
            {
              id: "s1",
              title: "S1",
              questions: [
                { id: "q1", type: "short_text", label: "Q1" },
                { id: "h1", type: "section_header", label: "Header" },
                { id: "q2", type: "short_text", label: "Q2" },
              ],
            },
          ],
        } as Partial<FormEngineSchema>),
      );

      const next = nav.resolveNextQuestionId("q1", {});
      expect(next!.question.id).toBe("q2");
    });
  });

  describe("resolvePrevQuestionId", () => {
    it("returns the previous question", () => {
      const nav = createNavigation(makeSchema());
      const prev = nav.resolvePrevQuestionId("q2", {});
      expect(prev).not.toBeNull();
      expect(prev!.question.id).toBe("q1");
      expect(prev!.sectionId).toBe("s1");
    });

    it("crosses section boundaries backward", () => {
      const nav = createNavigation(makeSchema());
      const prev = nav.resolvePrevQuestionId("q2", {});
      expect(prev!.sectionId).toBe("s1");
    });

    it("returns null at the first question", () => {
      const nav = createNavigation(makeSchema());
      expect(nav.resolvePrevQuestionId("q1", {})).toBeNull();
    });
  });

  describe("getInitialQuestionId", () => {
    it("returns the first visible input question", () => {
      const nav = createNavigation(makeSchema());
      expect(nav.getInitialQuestionId({})).toBe("q1");
    });

    it("skips structural fields at the start", () => {
      const nav = createNavigation(
        makeSchema({
          sections: [
            {
              id: "s1",
              title: "S1",
              questions: [
                { id: "ws", type: "welcome-screen", label: "Welcome" },
                { id: "q1", type: "short_text", label: "Name" },
              ],
            },
          ],
        } as Partial<FormEngineSchema>),
      );

      expect(nav.getInitialQuestionId({})).toBe("q1");
    });

    it("returns empty string when no input questions exist", () => {
      const nav = createNavigation(
        makeSchema({
          sections: [
            {
              id: "s1",
              title: "S1",
              questions: [
                { id: "h1", type: "section_header", label: "Header" },
                { id: "d1", type: "divider", label: "" },
              ],
            },
          ],
        } as Partial<FormEngineSchema>),
      );

      expect(nav.getInitialQuestionId({})).toBe("");
    });
  });
});
