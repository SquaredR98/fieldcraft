import type { FormEngineTheme } from "@squaredr/formengine-core";

export const clinicalPreset: FormEngineTheme = {
  colors: {
    primary: "#0284C7",
    primaryForeground: "#ffffff",
    secondary: "#0891B2",
    secondaryForeground: "#ffffff",
    error: "#DC2626",
    errorForeground: "#ffffff",
    warning: "#D97706",
    success: "#16A34A",
    surface: "#ffffff",
    background: "#F0F9FF",
    text: "#0C4A6E",
    textMuted: "#64748B",
    textDisabled: "#CBD5E1",
    border: "#BAE6FD",
    borderFocus: "#0284C7",
    inputBackground: "#ffffff",
  },
  typography: {
    fontFamily: "'Source Sans 3', 'Segoe UI', system-ui, sans-serif",
    scale: "comfortable",
    questionSize: "1.0625rem",
    labelSize: "0.875rem",
    helpTextSize: "0.8125rem",
    bodySize: "0.9375rem",
  },
  shape: {
    radius: "sm",
    inputRadius: "6px",
    buttonRadius: "6px",
    cardRadius: "8px",
  },
  spacing: {
    base: 16,
    sectionGap: 28,
    fieldGap: 24,
    inputPaddingX: 12,
    inputPaddingY: 10,
  },
  layout: {
    maxWidth: "680px",
    alignment: "left",
    progressPosition: "top",
    sectionLayout: "bordered",
  },
};
