import { describe, it, expect } from "vitest";
import { createFieldRegistry, mergeRegistries } from "../../src/registry/field-registry";
import type { FieldRegistry, FieldComponent } from "../../src/registry/field-registry";

// Minimal mock components for testing registry operations
const MockTextComponent = (() => null) as unknown as FieldComponent;
const MockNumberComponent = (() => null) as unknown as FieldComponent;
const MockEmailComponent = (() => null) as unknown as FieldComponent;
const MockCustomComponent = (() => null) as unknown as FieldComponent;

// ---- createFieldRegistry ----

describe("createFieldRegistry", () => {
  it("creates an empty registry when no initial map is provided", () => {
    const registry = createFieldRegistry();
    expect(registry).toEqual({});
  });

  it("creates a registry with initial mappings", () => {
    const registry = createFieldRegistry({
      short_text: MockTextComponent,
      number: MockNumberComponent,
    });
    expect(registry.short_text).toBe(MockTextComponent);
    expect(registry.number).toBe(MockNumberComponent);
  });

  it("returns a new object (not the same reference)", () => {
    const initial: FieldRegistry = { short_text: MockTextComponent };
    const registry = createFieldRegistry(initial);
    expect(registry).not.toBe(initial);
    expect(registry).toEqual(initial);
  });

  it("mutations to returned registry don't affect the original", () => {
    const initial: FieldRegistry = { short_text: MockTextComponent };
    const registry = createFieldRegistry(initial);
    registry.email = MockEmailComponent;
    expect(initial.email).toBeUndefined();
  });
});

// ---- mergeRegistries ----

describe("mergeRegistries", () => {
  it("merges two registries", () => {
    const a: FieldRegistry = { short_text: MockTextComponent };
    const b: FieldRegistry = { number: MockNumberComponent };
    const merged = mergeRegistries(a, b);
    expect(merged.short_text).toBe(MockTextComponent);
    expect(merged.number).toBe(MockNumberComponent);
  });

  it("later registries override earlier ones", () => {
    const a: FieldRegistry = { short_text: MockTextComponent };
    const b: FieldRegistry = { short_text: MockCustomComponent };
    const merged = mergeRegistries(a, b);
    expect(merged.short_text).toBe(MockCustomComponent);
  });

  it("handles three registries", () => {
    const a: FieldRegistry = { short_text: MockTextComponent };
    const b: FieldRegistry = { number: MockNumberComponent };
    const c: FieldRegistry = { email: MockEmailComponent };
    const merged = mergeRegistries(a, b, c);
    expect(merged.short_text).toBe(MockTextComponent);
    expect(merged.number).toBe(MockNumberComponent);
    expect(merged.email).toBe(MockEmailComponent);
  });

  it("skips undefined registries", () => {
    const a: FieldRegistry = { short_text: MockTextComponent };
    const merged = mergeRegistries(a, undefined, undefined);
    expect(merged.short_text).toBe(MockTextComponent);
  });

  it("returns empty registry when all inputs are undefined", () => {
    const merged = mergeRegistries(undefined, undefined);
    expect(merged).toEqual({});
  });

  it("returns empty registry when called with no arguments", () => {
    const merged = mergeRegistries();
    expect(merged).toEqual({});
  });

  it("does not mutate original registries", () => {
    const a: FieldRegistry = { short_text: MockTextComponent };
    const b: FieldRegistry = { number: MockNumberComponent };
    mergeRegistries(a, b);
    expect(a.number).toBeUndefined();
    expect(b.short_text).toBeUndefined();
  });
});
