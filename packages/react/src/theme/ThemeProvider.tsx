import { createContext, useContext, useMemo } from "react";
import type { FormEngineTheme } from "@squaredr/fieldcraft-core";
import { themeToCssVars } from "./theme-to-css-vars";
import { cleanPreset } from "./presets/clean";

const ThemeContext = createContext<FormEngineTheme>(cleanPreset);

export function useTheme(): FormEngineTheme {
  return useContext(ThemeContext);
}

export function FormEngineThemeProvider({
  theme,
  children,
}: {
  theme?: FormEngineTheme;
  children: React.ReactNode;
}) {
  const resolved = theme ?? cleanPreset;
  const cssVars = useMemo(() => themeToCssVars(resolved), [resolved]);

  return (
    <div style={cssVars} className="w-full">
      <ThemeContext.Provider value={resolved}>{children}</ThemeContext.Provider>
    </div>
  );
}
