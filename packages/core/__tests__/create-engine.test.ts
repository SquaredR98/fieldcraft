import { describe, it, expect, vi } from "vitest";
import { createEngine } from "../src/engine/create-engine";
import type { FormEngineSchema } from "../src/types/schema";

function makeSchema(overrides?: Partial<FormEngineSchema>): FormEngineSchema {
  return {
    id: "integration-test",
    version: "1.0.0",
    title: "Integration Test Form",
    sections: [
      {
        id: "s1",
        title: "Personal Info",
        questions: [
          { id: "name", type: "short_text", label: "Name", required: true },
          { id: "email", type: "email", label: "Email", validation: [{ type: "email" }] },
        ],
      },
      {
        id: "s2",
        title: "Details",
        questions: [
          { id: "age", type: "number", label: "Age", validation: [{ type: "min", value: 0 }, { type: "max", value: 150 }] },
          { id: "bio", type: "long_text", label: "Bio" },
        ],
      },
    ],
    submitAction: { type: "callback" },
    ...overrides,
  } as FormEngineSchema;
}

describe("createEngine", () => {
  describe("creation and initialization", () => {
    it("creates an engine from a valid schema", () => {
      const engine = createEngine(makeSchema());
      expect(engine).toBeDefined();
      expect(engine.getState).toBeDefined();
      expect(engine.setValue).toBeDefined();
      expect(engine.submit).toBeDefined();
    });

    it("throws on invalid schema", () => {
      expect(() => createEngine({} as FormEngineSchema)).toThrow();
    });

    it("initializes with empty state", () => {
      const engine = createEngine(makeSchema());
      const state = engine.getState();

      expect(state.values).toEqual({});
      expect(state.errors).toEqual({});
      expect(state.isDirty).toBe(false);
      expect(state.isSubmitting).toBe(false);
      expect(state.isSubmitted).toBe(false);
      expect(state.currentSectionId).toBe("s1");
    });

    it("initializes with provided initial values", () => {
      const engine = createEngine(makeSchema(), {
        initialValues: { name: "Jane", email: "jane@example.com" },
      });
      const state = engine.getState();

      expect(state.values.name).toBe("Jane");
      expect(state.values.email).toBe("jane@example.com");
    });

    it("merges prefill values with initial values (initial takes precedence)", () => {
      const engine = createEngine(makeSchema(), {
        prefillValues: { name: "Prefill Name", age: 30 },
        initialValues: { name: "Initial Name" },
      });
      const state = engine.getState();

      expect(state.values.name).toBe("Initial Name");
      expect(state.values.age).toBe(30);
    });
  });

  describe("setValue / getState lifecycle", () => {
    it("sets a value and marks form as dirty", () => {
      const engine = createEngine(makeSchema());
      engine.setValue("name", "John");

      const state = engine.getState();
      expect(state.values.name).toBe("John");
      expect(state.isDirty).toBe(true);
    });

    it("does not update state when setting same value", () => {
      const engine = createEngine(makeSchema(), {
        initialValues: { name: "John" },
      });
      const listener = vi.fn();
      engine.subscribe(listener);

      engine.setValue("name", "John");
      expect(listener).not.toHaveBeenCalled();
    });

    it("setValues updates multiple values at once", () => {
      const engine = createEngine(makeSchema());
      engine.setValues({ name: "Jane", email: "jane@test.com" });

      const state = engine.getState();
      expect(state.values.name).toBe("Jane");
      expect(state.values.email).toBe("jane@test.com");
    });
  });

  describe("subscribe", () => {
    it("notifies listeners on state change", () => {
      const engine = createEngine(makeSchema());
      const listener = vi.fn();
      engine.subscribe(listener);

      engine.setValue("name", "Jane");
      expect(listener).toHaveBeenCalledOnce();
    });

    it("unsubscribe stops notifications", () => {
      const engine = createEngine(makeSchema());
      const listener = vi.fn();
      const unsub = engine.subscribe(listener);

      engine.setValue("name", "Jane");
      expect(listener).toHaveBeenCalledOnce();

      unsub();
      listener.mockClear();
      engine.setValue("name", "John");
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("validation", () => {
    it("validates all fields", () => {
      const engine = createEngine(makeSchema());
      const result = engine.validate();

      // name is required and empty
      expect(result.valid).toBe(false);
      expect(result.errors.name).toBeDefined();
    });

    it("validates all fields pass when filled correctly", () => {
      const engine = createEngine(makeSchema(), {
        initialValues: { name: "Jane" },
      });
      const result = engine.validate();

      expect(result.valid).toBe(true);
    });

    it("validates a specific section", () => {
      const engine = createEngine(makeSchema());
      const result = engine.validateSection("s1");

      expect(result.valid).toBe(false);
      expect(result.errors.name).toBeDefined();
    });

    it("returns valid for unknown section", () => {
      const engine = createEngine(makeSchema());
      const result = engine.validateSection("nonexistent");

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it("inline validation on setValue", () => {
      const engine = createEngine(makeSchema());
      engine.setValue("age", -5);

      const state = engine.getState();
      expect(state.errors.age).toBeDefined();
      expect(state.errors.age.length).toBeGreaterThan(0);
    });

    it("clears field errors when value becomes valid", () => {
      const engine = createEngine(makeSchema());
      engine.setValue("age", -5);
      expect(engine.getState().errors.age.length).toBeGreaterThan(0);

      engine.setValue("age", 25);
      expect(engine.getState().errors.age).toEqual([]);
    });
  });

  describe("field operations", () => {
    it("touchField marks field as touched", () => {
      const engine = createEngine(makeSchema());
      engine.touchField("name");
      expect(engine.getState().touched.name).toBe(true);
    });

    it("clearField removes value, errors, and touched state", () => {
      const engine = createEngine(makeSchema(), {
        initialValues: { name: "John" },
      });
      engine.touchField("name");
      engine.clearField("name");

      const state = engine.getState();
      expect(state.values.name).toBeUndefined();
      expect(state.touched.name).toBeUndefined();
    });

    it("getFieldError returns errors for invalid field", () => {
      const engine = createEngine(makeSchema());
      engine.touchField("name"); // name is required, triggers validation
      expect(engine.getFieldError("name")).toBeDefined();
    });

    it("getFieldError returns undefined for valid/untouched field", () => {
      const engine = createEngine(makeSchema());
      expect(engine.getFieldError("email")).toBeUndefined();
    });
  });

  describe("navigation", () => {
    it("starts at first section", () => {
      const engine = createEngine(makeSchema());
      expect(engine.getState().currentSectionId).toBe("s1");
    });

    it("nextSection moves to the next section", () => {
      const engine = createEngine(makeSchema());
      engine.nextSection();
      expect(engine.getState().currentSectionId).toBe("s2");
    });

    it("prevSection moves back", () => {
      const engine = createEngine(makeSchema());
      engine.nextSection();
      engine.prevSection();
      expect(engine.getState().currentSectionId).toBe("s1");
    });

    it("jumpTo moves to a specific section", () => {
      const engine = createEngine(makeSchema());
      engine.jumpTo("s2");
      expect(engine.getState().currentSectionId).toBe("s2");
    });
  });

  describe("visibility helpers", () => {
    it("getVisibleSections returns all sections when no conditions", () => {
      const engine = createEngine(makeSchema());
      const sections = engine.getVisibleSections();
      expect(sections).toHaveLength(2);
    });

    it("getVisibleSections hides sections with unmet conditions", () => {
      const schema = makeSchema({
        sections: [
          {
            id: "s1",
            title: "S1",
            questions: [{ id: "show_s2", type: "boolean", label: "Show S2?" }],
          },
          {
            id: "s2",
            title: "S2",
            showIf: { field: "show_s2", operator: "eq", value: true },
            questions: [{ id: "q2", type: "short_text", label: "Q2" }],
          },
        ],
      } as Partial<FormEngineSchema>);

      const engine = createEngine(schema);
      expect(engine.getVisibleSections()).toHaveLength(1);

      engine.setValue("show_s2", true);
      expect(engine.getVisibleSections()).toHaveLength(2);
    });

    it("getVisibleFields returns visible fields for a section", () => {
      const engine = createEngine(makeSchema());
      const fields = engine.getVisibleFields("s1");
      expect(fields).toHaveLength(2);
    });

    it("getVisibleFields returns empty for unknown section", () => {
      const engine = createEngine(makeSchema());
      expect(engine.getVisibleFields("nonexistent")).toEqual([]);
    });

    it("isFieldRequired returns true for required fields", () => {
      const engine = createEngine(makeSchema());
      expect(engine.isFieldRequired("name")).toBe(true);
      expect(engine.isFieldRequired("bio")).toBe(false);
    });

    it("isFieldVisible returns true for fields without showIf", () => {
      const engine = createEngine(makeSchema());
      expect(engine.isFieldVisible("name")).toBe(true);
    });

    it("isFieldDisabled returns false by default", () => {
      const engine = createEngine(makeSchema());
      expect(engine.isFieldDisabled("name")).toBe(false);
    });

    it("isFieldRequired/isFieldVisible/isFieldDisabled return false for unknown fields", () => {
      const engine = createEngine(makeSchema());
      expect(engine.isFieldRequired("unknown")).toBe(false);
      expect(engine.isFieldVisible("unknown")).toBe(false);
      expect(engine.isFieldDisabled("unknown")).toBe(false);
    });
  });

  describe("schema accessors", () => {
    it("getSchema returns the validated schema", () => {
      const engine = createEngine(makeSchema());
      const schema = engine.getSchema();
      expect(schema.id).toBe("integration-test");
      expect(schema.sections).toHaveLength(2);
    });

    it("getSectionById returns the section", () => {
      const engine = createEngine(makeSchema());
      const section = engine.getSectionById("s1");
      expect(section?.title).toBe("Personal Info");
    });

    it("getSectionById returns undefined for unknown", () => {
      const engine = createEngine(makeSchema());
      expect(engine.getSectionById("nope")).toBeUndefined();
    });

    it("getQuestionById returns the question", () => {
      const engine = createEngine(makeSchema());
      const q = engine.getQuestionById("name");
      expect(q?.label).toBe("Name");
    });

    it("getQuestionById returns undefined for unknown", () => {
      const engine = createEngine(makeSchema());
      expect(engine.getQuestionById("nope")).toBeUndefined();
    });
  });

  describe("callbacks", () => {
    it("calls onStateChange on mutations", () => {
      const onStateChange = vi.fn();
      const engine = createEngine(makeSchema(), { onStateChange });

      engine.setValue("name", "Jane");
      expect(onStateChange).toHaveBeenCalled();
    });

    it("calls onFieldChange on setValue", () => {
      const onFieldChange = vi.fn();
      const engine = createEngine(makeSchema(), { onFieldChange });

      engine.setValue("name", "Jane");
      expect(onFieldChange).toHaveBeenCalledWith("name", "Jane");
    });

    it("calls onSectionChange on navigation", () => {
      const onSectionChange = vi.fn();
      const engine = createEngine(makeSchema(), { onSectionChange });

      engine.nextSection();
      expect(onSectionChange).toHaveBeenCalledWith("s2", 1);
    });
  });

  describe("submit lifecycle", () => {
    it("submit fails validation when required fields are empty", async () => {
      const engine = createEngine(makeSchema());

      const result = await engine.submit();

      expect(result.success).toBe(false);
      expect(result.adapterResults[0].adapterName).toBe("validation");
      expect(result.adapterResults[0].error).toContain("Validation failed");
    });

    it("submit succeeds with valid data and onSubmit callback", async () => {
      const onSubmit = vi.fn();
      const engine = createEngine(makeSchema(), {
        initialValues: { name: "Jane" },
        onSubmit,
      });

      const result = await engine.submit();

      expect(result.success).toBe(true);
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          schemaId: "integration-test",
          values: expect.objectContaining({ name: "Jane" }),
        }),
      );
    });

    it("submit sets isSubmitted on success", async () => {
      const engine = createEngine(makeSchema(), {
        initialValues: { name: "Jane" },
        onSubmit: vi.fn(),
      });

      await engine.submit();

      expect(engine.getState().isSubmitted).toBe(true);
      expect(engine.getState().isSubmitting).toBe(false);
    });

    it("submit sets submitError on failure", async () => {
      const engine = createEngine(makeSchema(), {
        initialValues: { name: "Jane" },
        onSubmit: vi.fn().mockRejectedValue(new Error("Server error")),
      });

      await engine.submit();

      expect(engine.getState().isSubmitted).toBe(false);
      expect(engine.getState().submitError).toContain("Server error");
    });

    it("submit uses adapters when no onSubmit", async () => {
      const adapter = {
        name: "test-adapter",
        submit: vi.fn(async () => {}),
      };
      const engine = createEngine(makeSchema(), {
        initialValues: { name: "Jane" },
        adapters: adapter,
      });

      const result = await engine.submit();

      expect(result.success).toBe(true);
      expect(adapter.submit).toHaveBeenCalledWith(
        expect.objectContaining({ schemaId: "integration-test" }),
      );
    });

    it("submit builds correct FormResponse", async () => {
      let capturedResponse: unknown;
      const engine = createEngine(makeSchema(), {
        initialValues: { name: "Jane", email: "jane@test.com" },
        onSubmit: (response) => { capturedResponse = response; },
      });

      await engine.submit();

      expect(capturedResponse).toMatchObject({
        schemaId: "integration-test",
        schemaVersion: "1.0.0",
        values: { name: "Jane", email: "jane@test.com" },
      });
      expect((capturedResponse as Record<string, unknown>).submittedAt).toBeDefined();
      expect((capturedResponse as Record<string, unknown>).sessionToken).toBeDefined();
      expect((capturedResponse as Record<string, unknown>).completionTimeMs).toBeGreaterThanOrEqual(0);
    });

    it("submit marks submitAttempted", async () => {
      const engine = createEngine(makeSchema());

      await engine.submit();

      expect(engine.getState().submitAttempted).toBe(true);
    });
  });

  describe("destroy", () => {
    it("destroy prevents further setValue calls", () => {
      const engine = createEngine(makeSchema());
      engine.destroy();

      expect(() => engine.setValue("name", "test")).toThrow("destroyed");
    });

    it("destroy prevents submit", async () => {
      const engine = createEngine(makeSchema(), {
        initialValues: { name: "Jane" },
      });
      engine.destroy();

      await expect(engine.submit()).rejects.toThrow("destroyed");
    });
  });

  describe("full lifecycle integration", () => {
    it("create → fill → navigate → validate → submit", async () => {
      const onSubmit = vi.fn();
      const engine = createEngine(makeSchema(), { onSubmit });

      // Start at s1
      expect(engine.getState().currentSectionId).toBe("s1");

      // Fill fields
      engine.setValue("name", "Jane Doe");
      engine.setValue("email", "jane@example.com");
      expect(engine.getState().isDirty).toBe(true);

      // Navigate to s2
      engine.nextSection();
      expect(engine.getState().currentSectionId).toBe("s2");

      // Fill more fields
      engine.setValue("age", 30);
      engine.setValue("bio", "A short bio");

      // Validate
      const validation = engine.validate();
      expect(validation.valid).toBe(true);

      // Submit
      const result = await engine.submit();
      expect(result.success).toBe(true);
      expect(engine.getState().isSubmitted).toBe(true);
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          values: {
            name: "Jane Doe",
            email: "jane@example.com",
            age: 30,
            bio: "A short bio",
          },
        }),
      );
    });
  });
});
