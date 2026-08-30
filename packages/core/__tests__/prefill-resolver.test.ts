import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { resolvePrefill } from "../src/engine/prefill-resolver";
import type { FormEngineSchema, Question } from "../src/types/schema";
import type { PrefillConfig } from "../src/types/settings";

// ---- helpers ----

function makeSchema(questions: Array<{
  id: string;
  prefillKey?: string;
  config?: Record<string, unknown>;
}>): FormEngineSchema {
  return {
    id: "test-form",
    version: "1.0.0",
    title: "Test",
    sections: [{
      id: "s1",
      title: "Section 1",
      questions: questions.map((q) => ({
        id: q.id,
        type: "short_text" as const,
        label: q.id,
        prefillKey: q.prefillKey,
        config: q.config as Question["config"],
      })),
    }],
    submitAction: { type: "callback" },
  };
}

function makeMultiSectionSchema(): FormEngineSchema {
  return {
    id: "multi-section",
    version: "1.0.0",
    title: "Multi",
    sections: [
      {
        id: "s1",
        title: "Section 1",
        questions: [
          { id: "name", type: "short_text", label: "Name", config: { type: "short_text", defaultValue: "Default Name" } as Question["config"] },
          { id: "email", type: "email", label: "Email" },
        ],
      },
      {
        id: "s2",
        title: "Section 2",
        questions: [
          { id: "age", type: "number", label: "Age", prefillKey: "user_age", config: { type: "number", defaultValue: 25 } as Question["config"] },
        ],
      },
    ],
    submitAction: { type: "callback" },
  };
}

// ---- URL mock ----

let originalWindow: typeof globalThis.window;

function mockUrlParams(search: string) {
  Object.defineProperty(globalThis, "window", {
    value: { location: { search } },
    writable: true,
    configurable: true,
  });
}

function clearWindowMock() {
  // @ts-expect-error — cleaning up mock
  delete globalThis.window;
}

// ---- setup/teardown ----

beforeEach(() => {
  originalWindow = globalThis.window;
  clearWindowMock();
});

afterEach(() => {
  if (originalWindow !== undefined) {
    Object.defineProperty(globalThis, "window", {
      value: originalWindow,
      writable: true,
      configurable: true,
    });
  } else {
    clearWindowMock();
  }
});

// ---- tests ----

describe("resolvePrefill", () => {
  describe("schema defaults (Layer 1)", () => {
    it("extracts defaultValue from question config", () => {
      const schema = makeSchema([
        { id: "name", config: { defaultValue: "Jane" } },
        { id: "email", config: { defaultValue: "jane@example.com" } },
      ]);

      const result = resolvePrefill(schema);

      expect(result).toEqual({
        name: "Jane",
        email: "jane@example.com",
      });
    });

    it("ignores questions without defaultValue", () => {
      const schema = makeSchema([
        { id: "name", config: { defaultValue: "Jane" } },
        { id: "email" },
        { id: "phone", config: { placeholder: "555-1234" } },
      ]);

      const result = resolvePrefill(schema);

      expect(result).toEqual({ name: "Jane" });
      expect(result).not.toHaveProperty("email");
      expect(result).not.toHaveProperty("phone");
    });

    it("collects defaults across multiple sections", () => {
      const schema = makeMultiSectionSchema();

      const result = resolvePrefill(schema);

      expect(result).toEqual({
        name: "Default Name",
        age: 25,
      });
    });
  });

  describe("URL params (Layer 2)", () => {
    it("prefills from URL params with default fe_ prefix", () => {
      const schema = makeSchema([
        { id: "name" },
        { id: "email" },
      ]);
      const config: PrefillConfig = { source: "url" };

      mockUrlParams("?fe_name=Alice&fe_email=alice%40example.com");
      const result = resolvePrefill(schema, undefined, config);

      expect(result).toEqual({
        name: "Alice",
        email: "alice@example.com",
      });
    });

    it("uses custom paramPrefix to strip keys", () => {
      const schema = makeSchema([{ id: "name" }]);
      const config: PrefillConfig = { source: "url", paramPrefix: "fc_" };

      mockUrlParams("?fc_name=Bob");
      const result = resolvePrefill(schema, undefined, config);

      expect(result).toEqual({ name: "Bob" });
    });

    it("ignores URL params that don't match any field id or prefillKey", () => {
      const schema = makeSchema([{ id: "name" }]);
      const config: PrefillConfig = { source: "url" };

      mockUrlParams("?fe_name=Alice&fe_unknown=ignored");
      const result = resolvePrefill(schema, undefined, config);

      expect(result).toEqual({ name: "Alice" });
      expect(result).not.toHaveProperty("unknown");
    });

    it("maps URL params using prefillKey instead of field id", () => {
      const schema = makeSchema([
        { id: "full_name", prefillKey: "name" },
      ]);
      const config: PrefillConfig = { source: "url" };

      mockUrlParams("?fe_name=Carol");
      const result = resolvePrefill(schema, undefined, config);

      expect(result).toEqual({ full_name: "Carol" });
    });

    it("does not read URL params when source is 'props'", () => {
      const schema = makeSchema([{ id: "name" }]);
      const config: PrefillConfig = { source: "props" };

      mockUrlParams("?fe_name=ShouldBeIgnored");
      const result = resolvePrefill(schema, {}, config);

      expect(result).not.toHaveProperty("name");
    });
  });

  describe("props values (Layer 3)", () => {
    it("prefills from props object using field id", () => {
      const schema = makeSchema([
        { id: "name" },
        { id: "email" },
      ]);

      const result = resolvePrefill(schema, { name: "Dave", email: "dave@co.com" });

      expect(result).toEqual({
        name: "Dave",
        email: "dave@co.com",
      });
    });

    it("maps props using prefillKey", () => {
      const schema = makeSchema([
        { id: "full_name", prefillKey: "name" },
      ]);

      const result = resolvePrefill(schema, { name: "Eve" });

      expect(result).toEqual({ full_name: "Eve" });
    });

    it("does not read props when source is 'url'", () => {
      const schema = makeSchema([{ id: "name" }]);
      const config: PrefillConfig = { source: "url" };

      const result = resolvePrefill(schema, { name: "Ignored" }, config);

      expect(result).not.toHaveProperty("name");
    });

    it("reads props when source is 'both'", () => {
      const schema = makeSchema([{ id: "name" }]);
      const config: PrefillConfig = { source: "both" };

      const result = resolvePrefill(schema, { name: "Frank" }, config);

      expect(result).toEqual({ name: "Frank" });
    });

    it("reads props when no prefillConfig is provided", () => {
      const schema = makeSchema([{ id: "name" }]);

      const result = resolvePrefill(schema, { name: "Grace" });

      expect(result).toEqual({ name: "Grace" });
    });
  });

  describe("priority: props > URL > defaults", () => {
    it("props override URL params", () => {
      const schema = makeSchema([
        { id: "name", config: { defaultValue: "Default" } },
      ]);
      const config: PrefillConfig = { source: "both" };

      mockUrlParams("?fe_name=FromURL");
      const result = resolvePrefill(schema, { name: "FromProps" }, config);

      expect(result.name).toBe("FromProps");
    });

    it("URL params override schema defaults", () => {
      const schema = makeSchema([
        { id: "name", config: { defaultValue: "Default" } },
      ]);
      const config: PrefillConfig = { source: "url" };

      mockUrlParams("?fe_name=FromURL");
      const result = resolvePrefill(schema, undefined, config);

      expect(result.name).toBe("FromURL");
    });

    it("schema defaults are used when no URL or props match", () => {
      const schema = makeSchema([
        { id: "name", config: { defaultValue: "FallbackDefault" } },
        { id: "email" },
      ]);
      const config: PrefillConfig = { source: "both" };

      const result = resolvePrefill(schema, {}, config);

      expect(result.name).toBe("FallbackDefault");
      expect(result).not.toHaveProperty("email");
    });
  });

  describe("transform function", () => {
    it("applies transform to URL params before matching", () => {
      const schema = makeSchema([
        { id: "name" },
        { id: "email" },
      ]);
      const config: PrefillConfig = {
        source: "url",
        transform: (raw) => ({
          name: (raw.name ?? "").toUpperCase(),
          email: raw.email,
        }),
      };

      mockUrlParams("?fe_name=alice&fe_email=alice%40co.com");
      const result = resolvePrefill(schema, undefined, config);

      expect(result.name).toBe("ALICE");
      expect(result.email).toBe("alice@co.com");
    });

    it("transform can add derived fields", () => {
      const schema = makeSchema([
        { id: "full_name", prefillKey: "full" },
      ]);
      const config: PrefillConfig = {
        source: "url",
        transform: (raw) => ({
          ...raw,
          full: `${raw.first} ${raw.last}`,
        }),
      };

      mockUrlParams("?fe_first=Jane&fe_last=Doe");
      const result = resolvePrefill(schema, undefined, config);

      expect(result.full_name).toBe("Jane Doe");
    });
  });

  describe("SSR safety", () => {
    it("returns only defaults when window is undefined", () => {
      clearWindowMock();

      const schema = makeSchema([
        { id: "name", config: { defaultValue: "SSR Default" } },
        { id: "email" },
      ]);
      const config: PrefillConfig = { source: "url" };

      const result = resolvePrefill(schema, undefined, config);

      expect(result).toEqual({ name: "SSR Default" });
    });

    it("does not crash when window exists but URLSearchParams is missing", () => {
      Object.defineProperty(globalThis, "window", {
        value: { location: { search: "?fe_name=test" } },
        writable: true,
        configurable: true,
      });
      const origUSP = globalThis.URLSearchParams;
      // @ts-expect-error — simulating missing URLSearchParams
      delete globalThis.URLSearchParams;

      const schema = makeSchema([{ id: "name" }]);
      const config: PrefillConfig = { source: "url" };

      const result = resolvePrefill(schema, undefined, config);

      // Should not crash, just return defaults
      expect(result).toEqual({});

      globalThis.URLSearchParams = origUSP;
    });
  });

  describe("edge cases", () => {
    it("returns empty object for schema with no questions", () => {
      const schema: FormEngineSchema = {
        id: "empty",
        version: "1.0.0",
        title: "Empty",
        sections: [{ id: "s1", title: "S1", questions: [] }],
        submitAction: { type: "callback" },
      };

      const result = resolvePrefill(schema);
      expect(result).toEqual({});
    });

    it("returns empty object when no arguments match", () => {
      const schema = makeSchema([{ id: "name" }, { id: "email" }]);

      const result = resolvePrefill(schema);
      expect(result).toEqual({});
    });

    it("preserves different value types from props", () => {
      const schema = makeSchema([
        { id: "count" },
        { id: "active" },
        { id: "tags" },
        { id: "meta" },
      ]);

      const result = resolvePrefill(schema, {
        count: 42,
        active: true,
        tags: ["a", "b"],
        meta: { nested: true },
      });

      expect(result).toEqual({
        count: 42,
        active: true,
        tags: ["a", "b"],
        meta: { nested: true },
      });
    });

    it("handles null and undefined values in props", () => {
      const schema = makeSchema([
        { id: "name" },
        { id: "email" },
      ]);

      const result = resolvePrefill(schema, {
        name: null,
        email: undefined,
      });

      // null is a valid value (explicit clear), undefined is "key in object" so still set
      expect(result.name).toBeNull();
      expect(result.email).toBeUndefined();
    });

    it("ignores props that don't match any field id or prefillKey", () => {
      const schema = makeSchema([{ id: "name" }]);

      const result = resolvePrefill(schema, {
        name: "Valid",
        unrelated_field: "Should not appear",
      });

      expect(result).toEqual({ name: "Valid" });
      expect(result).not.toHaveProperty("unrelated_field");
    });
  });
});
