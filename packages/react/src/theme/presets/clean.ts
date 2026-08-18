import type { FormEngineTheme } from "@squaredr/fieldcraft-core";

export const cleanPreset: FormEngineTheme = {
  colors: {
    primary: "#1F6B6E",
    primaryForeground: "#FFFFFF",
    secondary: "#B9D1CF",
    secondaryForeground: "#12222A",
    error: "#B04A3C",
    errorForeground: "#FFFFFF",
    warning: "#C98A2E",
    success: "#2E7D5B",
    surface: "#FFFFFF",
    background: "#F4F7F8",
    text: "#12222A",
    textMuted: "#6A7B85",
    textDisabled: "#B9D1CF",
    border: "#DCE4E8",
    borderFocus: "#1F6B6E",
    inputBackground: "#FFFFFF",
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
    radius: "none",
    inputRadius: "0px",
    buttonRadius: "0px",
    cardRadius: "0px",
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
