import type { FormEngineTheme } from "@squaredr/fieldcraft-core";

export const modernPreset: FormEngineTheme = {
  colors: {
    primary: "#6366F1",
    primaryForeground: "#ffffff",
    secondary: "#8B5CF6",
    secondaryForeground: "#ffffff",
    error: "#F43F5E",
    errorForeground: "#ffffff",
    warning: "#F59E0B",
    success: "#22C55E",
    surface: "#ffffff",
    background: "#FAFAFA",
    text: "#18181B",
    textMuted: "#71717A",
    textDisabled: "#D4D4D8",
    border: "#E4E4E7",
    borderFocus: "#6366F1",
    inputBackground: "#FAFAFA",
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', Inter, system-ui, sans-serif",
    scale: "comfortable",
    questionSize: "1.25rem",
    labelSize: "0.875rem",
    helpTextSize: "0.8125rem",
    bodySize: "1rem",
  },
  shape: {
    radius: "lg",
    inputRadius: "12px",
    buttonRadius: "12px",
    cardRadius: "16px",
  },
  spacing: {
    base: 16,
    sectionGap: 40,
    fieldGap: 28,
    inputPaddingX: 16,
    inputPaddingY: 12,
  },
  layout: {
    maxWidth: "680px",
    alignment: "center",
    progressPosition: "top",
    sectionLayout: "card",
  },
};
