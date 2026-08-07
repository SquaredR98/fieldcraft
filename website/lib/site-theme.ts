import type { FormEngineTheme } from '@squaredr/fieldcraft-core';

/**
 * A FormEngineTheme that inherits from the website's CSS custom properties
 * instead of using hardcoded colors. This ensures the renderer matches
 * the Drafting Teal design system in both light and dark modes.
 */
export const siteTheme: FormEngineTheme = {
  colors: {
    primary: 'var(--teal)',
    primaryForeground: 'var(--teal-on)',
    secondary: 'var(--wash)',
    secondaryForeground: 'var(--ink)',
    error: 'var(--danger)',
    errorForeground: '#ffffff',
    warning: 'var(--amber)',
    success: 'var(--teal)',
    surface: 'var(--surface)',
    background: 'var(--bg)',
    text: 'var(--ink)',
    border: 'var(--rule)',
    borderFocus: 'var(--teal)',
  },
  typography: {
    fontFamily: 'var(--font-body)',
    questionSize: '1rem',
    labelSize: '0.875rem',
    helpTextSize: '0.8125rem',
    bodySize: '0.9375rem',
  },
  shape: {
    radius: 'none',
    inputRadius: '0px',
    buttonRadius: '0px',
    cardRadius: '0px',
  },
  spacing: {
    base: 16,
    sectionGap: 28,
    fieldGap: 22,
    inputPaddingX: 12,
    inputPaddingY: 10,
  },
  layout: {
    maxWidth: '100%',
    alignment: 'left',
    progressPosition: 'top',
    sectionLayout: 'flat',
  },
};
