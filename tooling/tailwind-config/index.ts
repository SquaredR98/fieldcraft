import type { Config } from "tailwindcss";

const config: Config = {
  content: [],
  theme: {
    extend: {
      colors: {
        fe: {
          primary: "var(--fe-color-primary, #0D9488)",
          "primary-fg": "var(--fe-color-primary-foreground, #FFFFFF)",
          error: "var(--fe-color-error, #DC2626)",
          warning: "var(--fe-color-warning, #F59E0B)",
          success: "var(--fe-color-success, #22C55E)",
          surface: "var(--fe-color-surface, #F9FAFB)",
          background: "var(--fe-color-background, #FFFFFF)",
          text: "var(--fe-color-text, #111827)",
          "text-muted": "var(--fe-color-text-muted, #6B7280)",
          border: "var(--fe-color-border, #D1D5DB)",
          "border-focus": "var(--fe-color-border-focus, #0D9488)",
          "input-bg": "var(--fe-color-input-bg, #FFFFFF)",
        },
      },
      fontFamily: {
        fe: ["var(--fe-font-family, Inter, sans-serif)"],
      },
      borderRadius: {
        fe: "var(--fe-border-radius, 8px)",
      },
      spacing: {
        "fe-base": "var(--fe-spacing-base, 16px)",
      },
    },
  },
  plugins: [],
};

export default config;
