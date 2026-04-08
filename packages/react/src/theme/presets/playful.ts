import type { FormEngineTheme } from "@squaredr/fieldcraft-core";

export const playfulPreset: FormEngineTheme = {
  colors: {
    primary: "#EC4899",
    primaryForeground: "#ffffff",
    secondary: "#8B5CF6",
    secondaryForeground: "#ffffff",
    error: "#EF4444",
    errorForeground: "#ffffff",
    warning: "#F59E0B",
    success: "#10B981",
    surface: "#ffffff",
    background: "#FFF7ED",
    text: "#1C1917",
    textMuted: "#78716C",
    textDisabled: "#D6D3D1",
    border: "#FDE68A",
    borderFocus: "#EC4899",
    inputBackground: "#FFFBEB",
  },
  typography: {
    fontFamily: "'Nunito', 'Comic Neue', system-ui, sans-serif",
    scale: "spacious",
    questionSize: "1.25rem",
    labelSize: "0.9375rem",
    helpTextSize: "0.875rem",
    bodySize: "1rem",
  },
  shape: {
    radius: "full",
    inputRadius: "9999px",
    buttonRadius: "9999px",
    cardRadius: "20px",
  },
  spacing: {
    base: 18,
    sectionGap: 36,
    fieldGap: 28,
    inputPaddingX: 18,
    inputPaddingY: 12,
  },
  layout: {
    maxWidth: "600px",
    alignment: "center",
    progressPosition: "top",
    sectionLayout: "card",
  },
};
