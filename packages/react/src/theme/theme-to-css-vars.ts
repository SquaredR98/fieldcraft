import type { FormEngineTheme } from "@squaredr/fieldcraft-core";

/** Convert a FormEngineTheme object into CSS custom properties for runtime theming. */
export function themeToCssVars(
  theme?: FormEngineTheme,
): React.CSSProperties | undefined {
  if (!theme) return undefined;

  const vars: Record<string, string> = {};

  // Colors — emit both --fc-* (for backwards compat) and shadcn variable names
  if (theme.colors) {
    for (const [key, value] of Object.entries(theme.colors)) {
      if (value !== undefined) {
        vars[`--fc-color-${camelToKebab(key)}`] = value;
      }
    }

    // Bridge: set shadcn CSS variables directly so they inherit at the ThemeProvider level
    const c = theme.colors;
    if (c.primary) vars["--primary"] = c.primary;
    if (c.primaryForeground) vars["--primary-foreground"] = c.primaryForeground;
    if (c.secondary) vars["--secondary"] = c.secondary;
    if (c.secondaryForeground) vars["--secondary-foreground"] = c.secondaryForeground;
    if (c.error) vars["--destructive"] = c.error;
    if (c.errorForeground) vars["--destructive-foreground"] = c.errorForeground;
    if (c.surface) {
      vars["--card"] = c.surface;
      vars["--popover"] = c.surface;
      vars["--accent"] = c.surface;
    }
    if (c.background) {
      vars["--background"] = c.background;
      vars["--muted"] = c.background;
    }
    if (c.text) {
      vars["--foreground"] = c.text;
      vars["--card-foreground"] = c.text;
      vars["--popover-foreground"] = c.text;
      vars["--accent-foreground"] = c.text;
    }
    if (c.textMuted) vars["--muted-foreground"] = c.textMuted;
    if (c.border) {
      vars["--border"] = c.border;
      vars["--input"] = c.border;
    }
    if (c.borderFocus) vars["--ring"] = c.borderFocus;
    if (c.inputBackground) vars["--input-background"] = c.inputBackground;
  }

  // Typography
  if (theme.typography) {
    const { fontFamily, scale, questionSize, labelSize, helpTextSize, bodySize } =
      theme.typography;
    if (fontFamily) vars["--fc-font-family"] = fontFamily;
    if (scale) vars["--fc-font-scale"] = scale;
    if (questionSize) vars["--fc-font-question"] = questionSize;
    if (labelSize) vars["--fc-font-label"] = labelSize;
    if (helpTextSize) vars["--fc-font-help"] = helpTextSize;
    if (bodySize) vars["--fc-font-body"] = bodySize;
  }

  // Shape
  if (theme.shape) {
    const { radius, inputRadius, buttonRadius, cardRadius } = theme.shape;
    if (radius) {
      const r = radiusToValue(radius);
      vars["--fc-radius"] = r;
      vars["--radius"] = r;
    }
    if (inputRadius) vars["--fc-radius-input"] = inputRadius;
    if (buttonRadius) vars["--fc-radius-button"] = buttonRadius;
    if (cardRadius) vars["--fc-radius-card"] = cardRadius;
  }

  // Spacing
  if (theme.spacing) {
    for (const [key, value] of Object.entries(theme.spacing)) {
      if (value !== undefined) {
        vars[`--fc-spacing-${camelToKebab(key)}`] = `${value}px`;
      }
    }
  }

  // Layout
  if (theme.layout) {
    const { maxWidth, alignment, progressPosition, sectionLayout } = theme.layout;
    if (maxWidth) vars["--fc-max-width"] = maxWidth;
    if (alignment) vars["--fc-alignment"] = alignment;
    if (progressPosition) vars["--fc-progress-position"] = progressPosition;
    if (sectionLayout) vars["--fc-section-layout"] = sectionLayout;
  }

  return vars as React.CSSProperties;
}

function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

function radiusToValue(radius: string): string {
  const map: Record<string, string> = {
    none: "0px",
    sm: "4px",
    md: "8px",
    lg: "12px",
    full: "9999px",
  };
  return map[radius] ?? radius;
}
