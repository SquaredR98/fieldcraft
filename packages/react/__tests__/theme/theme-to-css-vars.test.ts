import { describe, it, expect } from "vitest";
import { themeToCssVars } from "../../src/theme/theme-to-css-vars";
import type { FormEngineTheme } from "@squaredr/fieldcraft-core";

describe("themeToCssVars", () => {
  it("returns undefined for undefined theme", () => {
    expect(themeToCssVars(undefined)).toBeUndefined();
  });

  it("returns undefined for empty theme", () => {
    expect(themeToCssVars({})).toEqual({});
  });

  it("converts colors to CSS vars", () => {
    const theme: FormEngineTheme = {
      colors: {
        primary: "#0D9488",
        primaryForeground: "#ffffff",
      },
    };
    const vars = themeToCssVars(theme) as Record<string, string>;
    expect(vars["--fc-color-primary"]).toBe("#0D9488");
    expect(vars["--fc-color-primary-foreground"]).toBe("#ffffff");
  });

  it("converts typography to CSS vars", () => {
    const theme: FormEngineTheme = {
      typography: {
        fontFamily: "Inter",
        scale: "compact",
        questionSize: "1.25rem",
      },
    };
    const vars = themeToCssVars(theme) as Record<string, string>;
    expect(vars["--fc-font-family"]).toBe("Inter");
    expect(vars["--fc-font-scale"]).toBe("compact");
    expect(vars["--fc-font-question"]).toBe("1.25rem");
  });

  it("converts shape radius tokens to px values", () => {
    const theme: FormEngineTheme = {
      shape: {
        radius: "lg",
        inputRadius: "8px",
      },
    };
    const vars = themeToCssVars(theme) as Record<string, string>;
    expect(vars["--fc-radius"]).toBe("12px");
    expect(vars["--fc-radius-input"]).toBe("8px");
  });

  it("converts spacing values with px suffix", () => {
    const theme: FormEngineTheme = {
      spacing: {
        base: 16,
        sectionGap: 32,
      },
    };
    const vars = themeToCssVars(theme) as Record<string, string>;
    expect(vars["--fc-spacing-base"]).toBe("16px");
    expect(vars["--fc-spacing-section-gap"]).toBe("32px");
  });

  it("converts layout properties", () => {
    const theme: FormEngineTheme = {
      layout: {
        maxWidth: "640px",
        alignment: "center",
        progressPosition: "top",
        sectionLayout: "card",
      },
    };
    const vars = themeToCssVars(theme) as Record<string, string>;
    expect(vars["--fc-max-width"]).toBe("640px");
    expect(vars["--fc-alignment"]).toBe("center");
    expect(vars["--fc-progress-position"]).toBe("top");
    expect(vars["--fc-section-layout"]).toBe("card");
  });

  it("skips undefined values", () => {
    const theme: FormEngineTheme = {
      colors: {
        primary: "#0D9488",
        // secondary is undefined
      },
    };
    const vars = themeToCssVars(theme) as Record<string, string>;
    expect(vars["--fc-color-primary"]).toBe("#0D9488");
    expect(vars["--fc-color-secondary"]).toBeUndefined();
  });

  it("handles all radius variants", () => {
    const variants = [
      { input: "none", expected: "0px" },
      { input: "sm", expected: "4px" },
      { input: "md", expected: "8px" },
      { input: "lg", expected: "12px" },
      { input: "full", expected: "9999px" },
    ] as const;

    for (const { input, expected } of variants) {
      const vars = themeToCssVars({ shape: { radius: input } }) as Record<string, string>;
      expect(vars["--fc-radius"]).toBe(expected);
    }
  });
});
