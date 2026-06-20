/**
 * Theme configuration for customizing the visual appearance of rendered forms.
 *
 * @description All properties are optional — unset values fall back to the active
 * theme preset's defaults. Pass to `FormEngineRenderer` via the `theme` prop or
 * use `ThemeProvider` for app-wide theming.
 *
 * @example
 * ```typescript
 * const theme: FormEngineTheme = {
 *   colors: { primary: "#2563eb", error: "#dc2626" },
 *   typography: { fontFamily: "Inter, sans-serif", scale: "comfortable" },
 *   shape: { radius: "md" },
 * };
 * ```
 *
 * @since 1.0.0
 */
export type FormEngineTheme = {
  /** Color tokens for the form UI. Maps to `--fc-*` CSS custom properties. */
  colors?: {
    /** Primary action color (buttons, focus rings, active states). */
    primary?: string;
    /** Text color on primary backgrounds. */
    primaryForeground?: string;
    /** Secondary/accent color. */
    secondary?: string;
    /** Text color on secondary backgrounds. */
    secondaryForeground?: string;
    /** Validation error color. */
    error?: string;
    /** Text color on error backgrounds. */
    errorForeground?: string;
    /** Warning indicator color. */
    warning?: string;
    /** Success indicator color. */
    success?: string;
    /** Card/panel surface color. */
    surface?: string;
    /** Page background color. */
    background?: string;
    /** Primary text color. */
    text?: string;
    /** Muted/secondary text color (help text, placeholders). */
    textMuted?: string;
    /** Disabled state text color. */
    textDisabled?: string;
    /** Default border color for inputs. */
    border?: string;
    /** Border color when an input is focused. */
    borderFocus?: string;
    /** Background color inside input fields. */
    inputBackground?: string;
  };
  /** Typography settings. */
  typography?: {
    /** CSS font-family value applied to the form. */
    fontFamily?: string;
    /** Spacing density preset. */
    scale?: "compact" | "comfortable" | "spacious";
    /** Font size for question/field labels. */
    questionSize?: string;
    /** Font size for sub-labels. */
    labelSize?: string;
    /** Font size for help text below fields. */
    helpTextSize?: string;
    /** Font size for body/option text. */
    bodySize?: string;
  };
  /** Border radius settings. */
  shape?: {
    /** Global border radius preset. */
    radius?: "none" | "sm" | "md" | "lg" | "full";
    /** Override radius for input fields. */
    inputRadius?: string;
    /** Override radius for buttons. */
    buttonRadius?: string;
    /** Override radius for cards/panels. */
    cardRadius?: string;
  };
  /** Spacing values in pixels. */
  spacing?: {
    /** Base spacing unit (multiplied for gaps). */
    base?: number;
    /** Vertical gap between sections. */
    sectionGap?: number;
    /** Vertical gap between fields within a section. */
    fieldGap?: number;
    /** Horizontal padding inside inputs. */
    inputPaddingX?: number;
    /** Vertical padding inside inputs. */
    inputPaddingY?: number;
  };
  /** Form layout configuration. */
  layout?: {
    /** Maximum width of the form container (CSS value). */
    maxWidth?: string;
    /** Horizontal alignment of the form within its parent. */
    alignment?: "left" | "center";
    /** Where the progress indicator is positioned. */
    progressPosition?: "top" | "bottom" | "none";
    /** Visual style for section containers. */
    sectionLayout?: "card" | "flat" | "bordered";
  };
};
