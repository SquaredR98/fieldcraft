import { describe, it, expect, vi, beforeEach } from "vitest";
import { createAnalyticsEmitter } from "../src/engine/analytics-emitter";
import type { FieldCraftEvent } from "../src/engine/analytics-emitter";

describe("createAnalyticsEmitter", () => {
  let events: FieldCraftEvent[];
  let onEvent: (event: FieldCraftEvent) => void;

  beforeEach(() => {
    events = [];
    onEvent = (event) => events.push(event);
  });

  // ---- No-op emitter ----

  describe("no-op emitter (no onEvent)", () => {
    it("returns emitter with all methods when onEvent is undefined", () => {
      const emitter = createAnalyticsEmitter("schema-1");
      expect(emitter.formView).toBeTypeOf("function");
      expect(emitter.formStart).toBeTypeOf("function");
      expect(emitter.fieldFocus).toBeTypeOf("function");
      expect(emitter.fieldComplete).toBeTypeOf("function");
      expect(emitter.sectionComplete).toBeTypeOf("function");
      expect(emitter.formSubmit).toBeTypeOf("function");
      expect(emitter.formAbandon).toBeTypeOf("function");
      expect(emitter.validationError).toBeTypeOf("function");
      expect(emitter.draftSave).toBeTypeOf("function");
      expect(emitter.draftResume).toBeTypeOf("function");
    });

    it("no-op methods do not throw", () => {
      const emitter = createAnalyticsEmitter("schema-1");
      expect(() => emitter.formView()).not.toThrow();
      expect(() => emitter.formStart("q1")).not.toThrow();
      expect(() => emitter.fieldFocus("q1")).not.toThrow();
      expect(() => emitter.fieldComplete("q1", 100)).not.toThrow();
      expect(() => emitter.sectionComplete("s1", 0)).not.toThrow();
      expect(() => emitter.formSubmit(5000, 10)).not.toThrow();
      expect(() => emitter.formAbandon("s1", 5)).not.toThrow();
      expect(() => emitter.validationError("q1", 2)).not.toThrow();
      expect(() => emitter.draftSave()).not.toThrow();
      expect(() => emitter.draftResume()).not.toThrow();
    });
  });

  // ---- Active emitter ----

  describe("formView", () => {
    it("emits fc_form_view with schemaId and timestamp", () => {
      const emitter = createAnalyticsEmitter("my-form", onEvent);
      emitter.formView();
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe("fc_form_view");
      expect(events[0].schemaId).toBe("my-form");
      expect(events[0].timestamp).toBeTypeOf("number");
    });
  });

  describe("formStart", () => {
    it("emits fc_form_start with fieldId", () => {
      const emitter = createAnalyticsEmitter("my-form", onEvent);
      emitter.formStart("first_field");
      expect(events).toHaveLength(1);
      const event = events[0] as Extract<FieldCraftEvent, { type: "fc_form_start" }>;
      expect(event.type).toBe("fc_form_start");
      expect(event.fieldId).toBe("first_field");
      expect(event.schemaId).toBe("my-form");
    });
  });

  describe("fieldFocus", () => {
    it("emits fc_field_focus with fieldId", () => {
      const emitter = createAnalyticsEmitter("my-form", onEvent);
      emitter.fieldFocus("name");
      expect(events).toHaveLength(1);
      const event = events[0] as Extract<FieldCraftEvent, { type: "fc_field_focus" }>;
      expect(event.type).toBe("fc_field_focus");
      expect(event.fieldId).toBe("name");
    });
  });

  describe("fieldComplete", () => {
    it("emits fc_field_complete with fieldId and durationMs", () => {
      const emitter = createAnalyticsEmitter("my-form", onEvent);
      emitter.fieldComplete("email", 1500);
      expect(events).toHaveLength(1);
      const event = events[0] as Extract<FieldCraftEvent, { type: "fc_field_complete" }>;
      expect(event.type).toBe("fc_field_complete");
      expect(event.fieldId).toBe("email");
      expect(event.durationMs).toBe(1500);
    });

    it("emits without durationMs when not provided", () => {
      const emitter = createAnalyticsEmitter("my-form", onEvent);
      emitter.fieldComplete("email");
      const event = events[0] as Extract<FieldCraftEvent, { type: "fc_field_complete" }>;
      expect(event.durationMs).toBeUndefined();
    });
  });

  describe("sectionComplete", () => {
    it("emits fc_section_complete with sectionId and sectionIndex", () => {
      const emitter = createAnalyticsEmitter("my-form", onEvent);
      emitter.sectionComplete("section-2", 1);
      expect(events).toHaveLength(1);
      const event = events[0] as Extract<FieldCraftEvent, { type: "fc_section_complete" }>;
      expect(event.type).toBe("fc_section_complete");
      expect(event.sectionId).toBe("section-2");
      expect(event.sectionIndex).toBe(1);
    });
  });

  describe("formSubmit", () => {
    it("emits fc_form_submit with completionTimeMs and fieldCount", () => {
      const emitter = createAnalyticsEmitter("my-form", onEvent);
      emitter.formSubmit(12500, 15);
      expect(events).toHaveLength(1);
      const event = events[0] as Extract<FieldCraftEvent, { type: "fc_form_submit" }>;
      expect(event.type).toBe("fc_form_submit");
      expect(event.completionTimeMs).toBe(12500);
      expect(event.fieldCount).toBe(15);
    });
  });

  describe("formAbandon", () => {
    it("emits fc_form_abandon with lastSectionId and completedFieldCount", () => {
      const emitter = createAnalyticsEmitter("my-form", onEvent);
      emitter.formAbandon("section-3", 8);
      expect(events).toHaveLength(1);
      const event = events[0] as Extract<FieldCraftEvent, { type: "fc_form_abandon" }>;
      expect(event.type).toBe("fc_form_abandon");
      expect(event.lastSectionId).toBe("section-3");
      expect(event.completedFieldCount).toBe(8);
    });
  });

  describe("validationError", () => {
    it("emits fc_validation_error with fieldId and errorCount", () => {
      const emitter = createAnalyticsEmitter("my-form", onEvent);
      emitter.validationError("email", 2);
      expect(events).toHaveLength(1);
      const event = events[0] as Extract<FieldCraftEvent, { type: "fc_validation_error" }>;
      expect(event.type).toBe("fc_validation_error");
      expect(event.fieldId).toBe("email");
      expect(event.errorCount).toBe(2);
    });
  });

  describe("draftSave", () => {
    it("emits fc_draft_save", () => {
      const emitter = createAnalyticsEmitter("my-form", onEvent);
      emitter.draftSave();
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe("fc_draft_save");
      expect(events[0].schemaId).toBe("my-form");
    });
  });

  describe("draftResume", () => {
    it("emits fc_draft_resume", () => {
      const emitter = createAnalyticsEmitter("my-form", onEvent);
      emitter.draftResume();
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe("fc_draft_resume");
      expect(events[0].schemaId).toBe("my-form");
    });
  });

  // ---- Shared behavior ----

  describe("shared behavior", () => {
    it("all events include schemaId", () => {
      const emitter = createAnalyticsEmitter("test-schema", onEvent);
      emitter.formView();
      emitter.formStart("q1");
      emitter.fieldFocus("q1");
      emitter.fieldComplete("q1");
      emitter.sectionComplete("s1", 0);
      emitter.formSubmit(1000, 5);
      emitter.formAbandon("s1", 3);
      emitter.validationError("q1", 1);
      emitter.draftSave();
      emitter.draftResume();
      expect(events).toHaveLength(10);
      for (const event of events) {
        expect(event.schemaId).toBe("test-schema");
      }
    });

    it("all events have a numeric timestamp", () => {
      const emitter = createAnalyticsEmitter("test-schema", onEvent);
      emitter.formView();
      emitter.formStart("q1");
      emitter.draftSave();
      for (const event of events) {
        expect(event.timestamp).toBeTypeOf("number");
        expect(event.timestamp).toBeGreaterThan(0);
      }
    });

    it("timestamps are roughly Date.now()", () => {
      const before = Date.now();
      const emitter = createAnalyticsEmitter("test-schema", onEvent);
      emitter.formView();
      const after = Date.now();
      expect(events[0].timestamp).toBeGreaterThanOrEqual(before);
      expect(events[0].timestamp).toBeLessThanOrEqual(after);
    });

    it("emitter can fire multiple events", () => {
      const emitter = createAnalyticsEmitter("test-schema", onEvent);
      emitter.formView();
      emitter.fieldFocus("q1");
      emitter.fieldComplete("q1", 500);
      emitter.formSubmit(2000, 5);
      expect(events).toHaveLength(4);
      expect(events.map((e) => e.type)).toEqual([
        "fc_form_view",
        "fc_field_focus",
        "fc_field_complete",
        "fc_form_submit",
      ]);
    });
  });
});
