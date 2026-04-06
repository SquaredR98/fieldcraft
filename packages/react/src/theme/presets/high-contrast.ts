import type { FormEngineTheme } from "@squaredr/formengine-core";

export const highContrastPreset: FormEngineTheme = {
  colors: {
    primary: "#0000EE",
    primaryForeground: "#ffffff",
    secondary: "#6B21A8",
    secondaryForeground: "#ffffff",
    error: "#B91C1C",
    errorForeground: "#ffffff",
    warning: "#92400E",
    success: "#166534",
    surface: "#ffffff",
    background: "#ffffff",
    text: "#000000",
    textMuted: "#374151",
    textDisabled: "#9CA3AF",
    border: "#000000",
    borderFocus: "#0000EE",
    inputBackground: "#ffffff",
  },
  typography: {
    fontFamily: "Arial, Helvetica, sans-serif",
    scale: "spacious",
    questionSize: "1.25rem",
    labelSize: "1rem",
    helpTextSize: "0.9375rem",
    bodySize: "1rem",
  },
  shape: {
    radius: "sm",
    inputRadius: "4px",
    buttonRadius: "4px",
    cardRadius: "4px",
  },
  spacing: {
    base: 20,
    sectionGap: 40,
    fieldGap: 32,
    inputPaddingX: 14,
    inputPaddingY: 12,
  },
  layout: {
    maxWidth: "720px",
    alignment: "left",
    progressPosition: "top",
    sectionLayout: "bordered",
  },
};
