import type { FormEngineTheme } from "@squaredr/fieldcraft-core";

/**
 * Six theme presets for visual testing and demo recording.
 *
 * Every value is a real `FormEngineTheme` passed to the `theme` prop — no CSS
 * overrides, no demo-only styling. That matters: a screenshot is only evidence
 * if what it shows is what a user gets from the same input.
 *
 * Chosen to look obviously different at thumbnail size, so the same behaviour
 * can be shown repeatedly without reading as one repeated image — and so the
 * theming system is demonstrated rather than claimed.
 *
 * Moved here from the standalone demo-studio workspace (removed 2026-10-13);
 * visual testing now happens in the website, which is load-bearing and so
 * cannot rot unnoticed.
 */

export type DemoTheme = {
  id: string;
  name: string;
  /** One line on what this preset is for — shown in the studio chrome. */
  note: string;
  /** Page backdrop behind the form. Recording surface only, never the form. */
  backdrop: string;
  theme: FormEngineTheme;
};

export const themes: DemoTheme[] = [
  {
    id: "clean",
    name: "Clean",
    note: "The default. Neutral, high contrast, nothing to argue with.",
    backdrop: "#F1F5F9",
    theme: {
      colors: {
        primary: "#2563EB",
        primaryForeground: "#FFFFFF",
        error: "#DC2626",
        errorForeground: "#FFFFFF",
        success: "#16A34A",
        warning: "#D97706",
        surface: "#FFFFFF",
        background: "#FFFFFF",
        text: "#0F172A",
        textMuted: "#64748B",
        border: "#E2E8F0",
        borderFocus: "#2563EB",
        inputBackground: "#FFFFFF",
      },
      typography: {
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
        scale: "comfortable",
      },
      shape: { radius: "md" },
      layout: { maxWidth: "560px", alignment: "center" },
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    note: "Dark mode. Proves the engine has no hardcoded light colours.",
    backdrop: "#0B1220",
    theme: {
      colors: {
        primary: "#6366F1",
        primaryForeground: "#FFFFFF",
        error: "#F87171",
        errorForeground: "#1E1B24",
        success: "#34D399",
        warning: "#FBBF24",
        surface: "#151C2C",
        background: "#151C2C",
        text: "#E8ECF4",
        textMuted: "#94A3B8",
        textDisabled: "#4B5563",
        border: "#2A3448",
        borderFocus: "#6366F1",
        inputBackground: "#1B2334",
      },
      typography: {
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
        scale: "comfortable",
      },
      shape: { radius: "md" },
      layout: { maxWidth: "560px", alignment: "center" },
    },
  },
  {
    id: "clinical",
    name: "Clinical",
    note: "Healthcare intake. Dense, sober, no rounded corners.",
    backdrop: "#EEF2F5",
    theme: {
      colors: {
        primary: "#0E7490",
        primaryForeground: "#FFFFFF",
        error: "#B91C1C",
        errorForeground: "#FFFFFF",
        success: "#047857",
        warning: "#B45309",
        surface: "#FFFFFF",
        background: "#FFFFFF",
        text: "#111827",
        textMuted: "#4B5563",
        border: "#CBD5E1",
        borderFocus: "#0E7490",
        inputBackground: "#F8FAFC",
      },
      typography: {
        fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif",
        scale: "compact",
      },
      shape: { radius: "none" },
      spacing: { fieldGap: 14, sectionGap: 22 },
      layout: { maxWidth: "620px", alignment: "left" },
    },
  },
  {
    id: "warm",
    name: "Warm",
    note: "Consumer / lifestyle. Soft, generous, friendly.",
    backdrop: "#FBF3EA",
    theme: {
      colors: {
        primary: "#C2410C",
        primaryForeground: "#FFFFFF",
        error: "#B91C1C",
        errorForeground: "#FFFFFF",
        success: "#15803D",
        warning: "#A16207",
        surface: "#FFFDFB",
        background: "#FFFDFB",
        text: "#292524",
        textMuted: "#78716C",
        border: "#E7D9C9",
        borderFocus: "#C2410C",
        inputBackground: "#FFFFFF",
      },
      typography: {
        fontFamily: "'Nunito', ui-rounded, ui-sans-serif, system-ui, sans-serif",
        scale: "spacious",
      },
      shape: { radius: "lg" },
      spacing: { fieldGap: 22, sectionGap: 34 },
      layout: { maxWidth: "540px", alignment: "center" },
    },
  },
  {
    id: "terminal",
    name: "Terminal",
    note: "Monospace, square, green-on-black. Reads as a dev tool.",
    backdrop: "#07100C",
    theme: {
      colors: {
        primary: "#22C55E",
        primaryForeground: "#04160C",
        error: "#F87171",
        errorForeground: "#1A0B0B",
        success: "#4ADE80",
        warning: "#FACC15",
        surface: "#0C1A12",
        background: "#0C1A12",
        text: "#D6F5E0",
        textMuted: "#6EA981",
        border: "#1D3A29",
        borderFocus: "#22C55E",
        inputBackground: "#0A1710",
      },
      typography: {
        fontFamily:
          "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
        scale: "compact",
      },
      shape: { radius: "none" },
      layout: { maxWidth: "600px", alignment: "left" },
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    note: "Corporate B2B. Restrained, slightly formal, dense labels.",
    backdrop: "#F4F5F7",
    theme: {
      colors: {
        primary: "#1E3A8A",
        primaryForeground: "#FFFFFF",
        error: "#9F1239",
        errorForeground: "#FFFFFF",
        success: "#065F46",
        warning: "#92400E",
        surface: "#FFFFFF",
        background: "#FFFFFF",
        text: "#1F2937",
        textMuted: "#6B7280",
        border: "#D1D5DB",
        borderFocus: "#1E3A8A",
        inputBackground: "#FFFFFF",
      },
      typography: {
        fontFamily: "'Source Sans 3', ui-sans-serif, system-ui, sans-serif",
        scale: "compact",
      },
      shape: { radius: "sm" },
      spacing: { fieldGap: 16, sectionGap: 26 },
      layout: { maxWidth: "640px", alignment: "left" },
    },
  },
];

export const themeById = (id: string): DemoTheme =>
  themes.find((t) => t.id === id) ?? themes[0];
