import type { FormEngineTheme } from "@squaredr/formengine-core";

export const cleanPreset: FormEngineTheme = {
  colors: {
    primary: "#0D9488",
    primaryForeground: "#ffffff",
    secondary: "#6366F1",
    secondaryForeground: "#ffffff",
    error: "#EF4444",
    errorForeground: "#ffffff",
    warning: "#F59E0B",
    success: "#10B981",
    surface: "#ffffff",
    background: "#F9FAFB",
    text: "#111827",
    textMuted: "#6B7280",
    textDisabled: "#D1D5DB",
    border: "#E5E7EB",
    borderFocus: "#0D9488",
    inputBackground: "#ffffff",
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
