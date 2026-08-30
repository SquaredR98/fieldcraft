import { describe, it, expect, vi } from "vitest";
import { createEngine } from "@squaredr/fieldcraft-core";
import { allTemplates } from "../src";
import type { FormResponse, Section, Question } from "@squaredr/fieldcraft-core";

function fillQuestion(engine: ReturnType<typeof createEngine>, q: Question) {
  switch (q.type) {
    case "short_text":
      engine.setValue(q.id, "Jane Doe");
      break;
    case "long_text":
      engine.setValue(
        q.id,
        "This is a detailed and comprehensive description written with sufficient length to satisfy all minimum and maximum length validation rules across all form templates.",
      );
      break;
    case "email":
      engine.setValue(q.id, "user@example.com");
      break;
    case "phone":
      engine.setValue(q.id, "+1 555 123 4567");
      break;
    case "url":
      engine.setValue(q.id, "https://fieldcraft.squaredr.tech");
      break;
    case "number":
    case "slider":
    case "rating":
    case "nps":
    case "opinion_scale":
      engine.setValue(q.id, 5);
      break;
    case "boolean":
    case "consent":
      engine.setValue(q.id, true);
      break;
    case "single_select":
    case "dropdown":
    case "likert":
    case "scoring":
      if (q.options && q.options.length > 0) {
        engine.setValue(q.id, q.options[0].value);
      } else {
        engine.setValue(q.id, "opt1");
      }
      break;
    case "multi_select":
      if (q.options && q.options.length > 0) {
        engine.setValue(q.id, [q.options[0].value]);
      } else {
        engine.setValue(q.id, ["opt1"]);
      }
      break;
    case "date":
      engine.setValue(q.id, "2026-08-30");
      break;
    case "time":
      engine.setValue(q.id, "10:00");
      break;
    case "ranking":
      if (q.options) {
        engine.setValue(q.id, q.options.map((o) => o.value));
      }
      break;
    case "matrix":
      engine.setValue(q.id, { r1: "c1", r2: "c2" });
      break;
    case "legal_name":
      engine.setValue(q.id, { first: "John", last: "Doe" });
      break;
    case "address":
      engine.setValue(q.id, { street: "123 Field Way", city: "Tech City", zip: "12345" });
      break;
    default:
      break;
  }
}

function fillSection(engine: ReturnType<typeof createEngine>, section: Section) {
  section.questions.forEach((q) => fillQuestion(engine, q));
}

describe("All 16 Templates - Engine Execution, Section Navigation & Submission", () => {
  allTemplates.forEach((template) => {
    describe(`Engine Execution: ${template.meta.name} (${template.meta.id})`, () => {
      it("creates an engine instance cleanly without errors", () => {
        const engine = createEngine(template.schema);
        expect(engine).toBeDefined();
        const state = engine.getState();
        expect(state.currentSectionId).toBe(template.schema.sections[0].id);
        expect(state.isSubmitting).toBe(false);
        expect(state.isSubmitted).toBe(false);
      });

      it("navigates forward and backward through all sections once validated", () => {
        const engine = createEngine(template.schema);
        const sections = template.schema.sections;

        if (sections.length > 1) {
          for (let i = 0; i < sections.length - 1; i++) {
            fillSection(engine, sections[i]);
            engine.nextSection();
            expect(engine.getState().currentSectionId).toBe(sections[i + 1].id);
          }

          for (let i = sections.length - 1; i > 0; i--) {
            engine.prevSection();
            expect(engine.getState().currentSectionId).toBe(sections[i - 1].id);
          }
        }
      });

      it("populates sample valid data and submits successfully", async () => {
        let submittedResponse: FormResponse | null = null;
        const onSubmit = vi.fn((resp: FormResponse) => {
          submittedResponse = resp;
        });

        const engine = createEngine(template.schema, { onSubmit });

        // Populate sample values for all questions across all sections
        template.schema.sections.forEach((sec) => {
          fillSection(engine, sec);
        });

        const result = await engine.submit();
        expect(result.success).toBe(true);
        expect(engine.getState().isSubmitted).toBe(true);
        expect(onSubmit).toHaveBeenCalledOnce();
        expect(submittedResponse).toBeDefined();
        const finalResp = submittedResponse as FormResponse | null;
        expect(finalResp?.schemaId).toBe(template.schema.id);
      });
    });
  });
});
