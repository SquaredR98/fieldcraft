import type { FormEngineTheme } from "@squaredr/formengine-core";

export const darkPreset: FormEngineTheme = {
  colors: {
    primary: "#22D3EE",
    primaryForeground: "#0F172A",
    secondary: "#A78BFA",
    secondaryForeground: "#0F172A",
    error: "#FB7185",
    errorForeground: "#0F172A",
    warning: "#FBBF24",
    success: "#34D399",
    surface: "#1E293B",
    background: "#0F172A",
    text: "#F1F5F9",
    textMuted: "#94A3B8",
    textDisabled: "#475569",
    border: "#334155",
    borderFocus: "#22D3EE",
    inputBackground: "#1E293B",
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    scale: "comfortable",
    questionSize: "1.125rem",
    labelSize: "0.875rem",
    helpTextSize: "0.8125rem",
    bodySize: "0.9375rem",
  },
  shape: {
    radius: "md",
    inputRadius: "8px",
    buttonRadius: "8px",
    cardRadius: "12px",
  },
  spacing: {
    base: 16,
    sectionGap: 32,
    fieldGap: 24,
    inputPaddingX: 12,
    inputPaddingY: 10,
  },
  layout: {
    maxWidth: "640px",
    alignment: "left",
    progressPosition: "top",
    sectionLayout: "card",
  },
};
