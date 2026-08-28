import { useEffect, useRef } from "react";
import type { HiddenConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";

/**
 * Hidden fields render nothing visible but still hold a value in form state.
 * On mount, auto-resolves value based on `config.source`:
 * - `"url_param"` → reads from URL query params via `config.paramName`
 * - `"cookie"` → reads from `document.cookie` via `config.cookieName`
 * - `"referrer"` → reads `document.referrer`
 * - `"static"` → handled by core's prefill-resolver (no action here)
 */
export function HiddenField({ field, value, onChange }: FieldProps) {
  const config = field.config as HiddenConfig | undefined;
  const resolved = useRef(false);

  useEffect(() => {
    if (resolved.current) return;
    resolved.current = true;
    // Only auto-resolve if current value is empty
    if (value != null && value !== "") return;
    if (typeof window === "undefined" || !config?.source) return;

    let resolved_value: string | undefined;

    if (config.source === "url_param" && config.paramName) {
      try {
        resolved_value = new URLSearchParams(window.location.search).get(config.paramName) ?? undefined;
      } catch { /* SSR or invalid URL */ }
    } else if (config.source === "cookie" && config.cookieName) {
      try {
        const match = document.cookie.split("; ").find((c) => c.startsWith(`${config.cookieName}=`));
        if (match) resolved_value = decodeURIComponent(match.split("=").slice(1).join("="));
      } catch { /* SSR or cookie parsing error */ }
    } else if (config.source === "referrer") {
      try {
        if (document.referrer) resolved_value = document.referrer;
      } catch { /* SSR */ }
    }

    if (resolved_value != null) {
      onChange(resolved_value);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <input
      type="hidden"
      id={field.id}
      name={field.id}
      value={value != null ? String(value) : ""}
    />
  );
}
