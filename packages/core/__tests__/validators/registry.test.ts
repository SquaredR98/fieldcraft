import { describe, it, expect } from "vitest";
import { createValidatorRegistry } from "../../src/validators/registry";
import type { CustomValidator, AsyncValidator } from "../../src/types/validation";

describe("createValidatorRegistry", () => {
  // ---- Custom validators ----

  describe("custom validators", () => {
    it("registers and retrieves a custom validator", () => {
      const registry = createValidatorRegistry();
      const validator: CustomValidator = (value) =>
        value === "bad" ? "Invalid value" : null;

      registry.registerCustom("noBad", validator);

      expect(registry.getCustom("noBad")).toBe(validator);
    });

    it("returns undefined for unregistered custom validator", () => {
      const registry = createValidatorRegistry();

      expect(registry.getCustom("nonexistent")).toBeUndefined();
    });

    it("accepts initial custom validators via constructor", () => {
      const validator: CustomValidator = (value) =>
        typeof value !== "string" ? "Must be a string" : null;

      const registry = createValidatorRegistry({ isString: validator });

      expect(registry.getCustom("isString")).toBe(validator);
    });

    it("overwrites a custom validator when registered with the same name", () => {
      const registry = createValidatorRegistry();
      const first: CustomValidator = () => "first";
      const second: CustomValidator = () => "second";

      registry.registerCustom("check", first);
      registry.registerCustom("check", second);

      const retrieved = registry.getCustom("check")!;
      expect(retrieved("", {})).toBe("second");
    });

    it("custom validator receives value, allValues, and params", () => {
      const registry = createValidatorRegistry();
      const crossField: CustomValidator = (value, values, params) => {
        const otherField = params?.otherField as string;
        if (otherField && value === values[otherField]) {
          return "Values must be different";
        }
        return null;
      };

      registry.registerCustom("notSameAs", crossField);

      const validator = registry.getCustom("notSameAs")!;
      expect(validator("hello", { other: "hello" }, { otherField: "other" })).toBe("Values must be different");
      expect(validator("hello", { other: "world" }, { otherField: "other" })).toBeNull();
    });
  });

  // ---- Async validators ----

  describe("async validators", () => {
    it("registers and retrieves an async validator", () => {
      const registry = createValidatorRegistry();
      const validator: AsyncValidator = async (value) =>
        value === "taken" ? "Already taken" : null;

      registry.registerAsync("uniqueEmail", validator);

      expect(registry.getAsync("uniqueEmail")).toBe(validator);
    });

    it("returns undefined for unregistered async validator", () => {
      const registry = createValidatorRegistry();

      expect(registry.getAsync("nonexistent")).toBeUndefined();
    });

    it("accepts initial async validators via constructor", () => {
      const validator: AsyncValidator = async () => null;

      const registry = createValidatorRegistry(undefined, { serverCheck: validator });

      expect(registry.getAsync("serverCheck")).toBe(validator);
    });

    it("async validator returns a promise", async () => {
      const registry = createValidatorRegistry();
      const validator: AsyncValidator = async (value) =>
        value === "taken@co.com" ? "Email already registered" : null;

      registry.registerAsync("checkEmail", validator);

      const fn = registry.getAsync("checkEmail")!;
      await expect(fn("taken@co.com")).resolves.toBe("Email already registered");
      await expect(fn("new@co.com")).resolves.toBeNull();
    });
  });

  // ---- Isolation ----

  describe("isolation", () => {
    it("custom and async registries are independent", () => {
      const registry = createValidatorRegistry();
      const customFn: CustomValidator = () => null;
      const asyncFn: AsyncValidator = async () => null;

      registry.registerCustom("check", customFn);
      registry.registerAsync("check", asyncFn);

      expect(registry.getCustom("check")).toBe(customFn);
      expect(registry.getAsync("check")).toBe(asyncFn);
    });

    it("separate registry instances do not share state", () => {
      const registryA = createValidatorRegistry();
      const registryB = createValidatorRegistry();
      const validator: CustomValidator = () => null;

      registryA.registerCustom("onlyInA", validator);

      expect(registryA.getCustom("onlyInA")).toBe(validator);
      expect(registryB.getCustom("onlyInA")).toBeUndefined();
    });
  });

  // ---- Empty registry ----

  describe("empty registry", () => {
    it("works with no initial validators", () => {
      const registry = createValidatorRegistry();

      expect(registry.getCustom("anything")).toBeUndefined();
      expect(registry.getAsync("anything")).toBeUndefined();
    });

    it("works with empty objects as initial validators", () => {
      const registry = createValidatorRegistry({}, {});

      expect(registry.getCustom("anything")).toBeUndefined();
      expect(registry.getAsync("anything")).toBeUndefined();
    });
  });
});
