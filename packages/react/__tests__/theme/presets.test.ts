import { describe, it, expect } from "vitest";
import { cleanPreset } from "../../src/theme/presets/clean";
import { modernPreset } from "../../src/theme/presets/modern";
import { darkPreset } from "../../src/theme/presets/dark";
import { highContrastPreset } from "../../src/theme/presets/high-contrast";
import { clinicalPreset } from "../../src/theme/presets/clinical";
import { playfulPreset } from "../../src/theme/presets/playful";
import type { FormEngineTheme } from "@squaredr/formengine-core";

const presets: [string, FormEngineTheme][] = [
  ["clean", cleanPreset],
  ["modern", modernPreset],
  ["dark", darkPreset],
  ["high-contrast", highContrastPreset],
  ["clinical", clinicalPreset],
  ["playful", playfulPreset],
];

describe("theme presets", () => {
  it.each(presets)("%s preset has all required color keys", (_, preset) => {
    expect(preset.colors).toBeDefined();
    expect(preset.colors!.primary).toBeDefined();
    expect(preset.colors!.error).toBeDefined();
    expect(preset.colors!.background).toBeDefined();
    expect(preset.colors!.text).toBeDefined();
    expect(preset.colors!.border).toBeDefined();
  });

  it.each(presets)("%s preset has typography", (_, preset) => {
    expect(preset.typography).toBeDefined();
    expect(preset.typography!.fontFamily).toBeDefined();
    expect(preset.typography!.scale).toBeDefined();
  });

  it.each(presets)("%s preset has shape", (_, preset) => {
    expect(preset.shape).toBeDefined();
    expect(preset.shape!.radius).toBeDefined();
  });

  it.each(presets)("%s preset has spacing", (_, preset) => {
    expect(preset.spacing).toBeDefined();
    expect(preset.spacing!.base).toBeGreaterThan(0);
  });

  it.each(presets)("%s preset has layout", (_, preset) => {
    expect(preset.layout).toBeDefined();
    expect(preset.layout!.maxWidth).toBeDefined();
  });

  it("dark preset has dark background", () => {
    expect(darkPreset.colors!.background).toBe("#0F172A");
  });

  it("high-contrast preset uses black text", () => {
    expect(highContrastPreset.colors!.text).toBe("#000000");
  });
});
