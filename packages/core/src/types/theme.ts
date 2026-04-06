export type FormEngineTheme = {
  colors?: {
    primary?: string;
    primaryForeground?: string;
    secondary?: string;
    secondaryForeground?: string;
    error?: string;
    errorForeground?: string;
    warning?: string;
    success?: string;
    surface?: string;
    background?: string;
    text?: string;
    textMuted?: string;
    textDisabled?: string;
    border?: string;
    borderFocus?: string;
    inputBackground?: string;
  };
  typography?: {
    fontFamily?: string;
    scale?: "compact" | "comfortable" | "spacious";
    questionSize?: string;
    labelSize?: string;
    helpTextSize?: string;
    bodySize?: string;
  };
  shape?: {
    radius?: "none" | "sm" | "md" | "lg" | "full";
    inputRadius?: string;
    buttonRadius?: string;
    cardRadius?: string;
  };
  spacing?: {
    base?: number;
    sectionGap?: number;
    fieldGap?: number;
    inputPaddingX?: number;
    inputPaddingY?: number;
  };
  layout?: {
    maxWidth?: string;
    alignment?: "left" | "center";
    progressPosition?: "top" | "bottom" | "none";
    sectionLayout?: "card" | "flat" | "bordered";
  };
};
