import { useEffect } from "react";
import type { ThankYouScreenConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";

export function ThankYouScreenField({ field }: FieldProps) {
  const config = field.config as ThankYouScreenConfig | undefined;

  if (!config) return null;

  // Handle redirect if configured
  useEffect(() => {
    if (config.redirectUrl && config.redirectDelay !== undefined && config.redirectDelay > 0) {
      const timer = setTimeout(() => {
        window.location.href = config.redirectUrl!;
      }, config.redirectDelay * 1000);

      return () => clearTimeout(timer);
    }
  }, [config.redirectUrl, config.redirectDelay]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "3rem 1rem",
        maxWidth: "600px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      {config.imageUrl && (
        <img
          src={config.imageUrl}
          alt={config.imageAlt ?? ""}
          style={{
            maxWidth: "100%",
            height: "auto",
            marginBottom: "2rem",
            borderRadius: "8px",
          }}
        />
      )}

      <h2
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          color: "inherit",
        }}
      >
        {config.heading}
      </h2>

      {config.description && (
        <p
          style={{
            fontSize: "1.125rem",
            color: "rgba(0, 0, 0, 0.6)",
            marginBottom: "2rem",
            lineHeight: "1.6",
          }}
        >
          {config.description}
        </p>
      )}

      {config.redirectUrl && config.redirectDelay && config.redirectDelay > 0 && (
        <p
          style={{
            fontSize: "0.875rem",
            color: "rgba(0, 0, 0, 0.5)",
            marginTop: "1rem",
          }}
        >
          Redirecting in {config.redirectDelay} seconds...
        </p>
      )}

      {/* Optional: Show submission summary if configured */}
      {config.showSummary && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            backgroundColor: "rgba(0, 0, 0, 0.02)",
            borderRadius: "8px",
            width: "100%",
          }}
        >
          <p style={{ fontSize: "0.875rem", color: "rgba(0, 0, 0, 0.6)" }}>
            Your response has been recorded.
          </p>
        </div>
      )}
    </div>
  );
}
