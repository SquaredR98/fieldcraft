import type { FormEngineTheme } from "@squaredr/fieldcraft-core";

export const darkPreset: FormEngineTheme = {
  colors: {
    primary: "#63BDB4",
    primaryForeground: "#0F1A1F",
    secondary: "#2F4F4C",
    secondaryForeground: "#E8EFF1",
    error: "#E08072",
    errorForeground: "#0F1A1F",
    warning: "#E0A94F",
    success: "#5DB89A",
    surface: "#16242A",
    background: "#0F1A1F",
    text: "#E8EFF1",
    textMuted: "#8CA1A9",
    textDisabled: "#3D5259",
    border: "#2A3B42",
    borderFocus: "#63BDB4",
    inputBackground: "#16242A",
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
