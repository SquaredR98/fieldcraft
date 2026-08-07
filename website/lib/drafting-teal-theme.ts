import type { FormEngineTheme } from '@squaredr/fieldcraft-core';

/**
 * Drafting Teal theme for the FieldCraft website demos.
 * Maps the website's design tokens to FormEngineTheme so rendered forms
 * match the surrounding Drafting Teal design system.
 */
export const draftingTealTheme: FormEngineTheme = {
  colors: {
    primary: '#1F6B6E',
    primaryForeground: '#FFFFFF',
    error: '#B04A3C',
    errorForeground: '#FFFFFF',
    warning: '#C98A2E',
    success: '#1F6B6E',
    surface: '#FFFFFF',
    background: '#F4F7F8',
    text: '#12222A',
    textMuted: '#6A7B85',
    textDisabled: '#A8B5BC',
    border: '#DCE4E8',
    borderFocus: '#1F6B6E',
    inputBackground: '#FFFFFF',
  },
  typography: {
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
    scale: 'comfortable',
    questionSize: '0.8125rem',
    labelSize: '0.8125rem',
    helpTextSize: '0.75rem',
    bodySize: '0.875rem',
  },
  shape: {
    radius: 'none',
    inputRadius: '0px',
    buttonRadius: '0px',
    cardRadius: '0px',
  },
  spacing: {
    base: 16,
    sectionGap: 24,
    fieldGap: 20,
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

/**
 * Dark variant for when the site is in dark mode.
 * The theme is applied via inline CSS vars from the ThemeProvider,
 * so each color must be set explicitly for dark mode.
 */
export const draftingTealDarkTheme: FormEngineTheme = {
  colors: {
    primary: '#63BDB4',
    primaryForeground: '#0F1A1F',
    error: '#E08072',
    errorForeground: '#0F1A1F',
    warning: '#E0A94F',
    success: '#63BDB4',
    surface: '#16242A',
    background: '#0F1A1F',
    text: '#E8EFF1',
    textMuted: '#8CA1A9',
    textDisabled: '#4A5C64',
    border: '#2A3B42',
    borderFocus: '#63BDB4',
    inputBackground: '#16242A',
  },
  typography: {
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
    scale: 'comfortable',
    questionSize: '0.8125rem',
    labelSize: '0.8125rem',
    helpTextSize: '0.75rem',
    bodySize: '0.875rem',
  },
  shape: {
    radius: 'none',
    inputRadius: '0px',
    buttonRadius: '0px',
    cardRadius: '0px',
  },
  spacing: {
    base: 16,
    sectionGap: 24,
    fieldGap: 20,
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
