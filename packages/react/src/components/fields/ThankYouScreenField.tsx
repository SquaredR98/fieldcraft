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
    <div className="fc-screen fc-screen--center">
      {config.imageUrl && (
        <img
          src={config.imageUrl}
          alt={config.imageAlt ?? ""}
          className="fc-screen__image"
        />
      )}

      <h2 className="fc-screen__heading">
        {config.heading}
      </h2>

      {config.description && (
        <p className="fc-screen__description">
          {config.description}
        </p>
      )}

      {config.redirectUrl && config.redirectDelay && config.redirectDelay > 0 && (
        <p className="fc-screen__redirect">
          Redirecting in {config.redirectDelay} seconds...
        </p>
      )}

      {config.showSummary && (
        <div className="fc-screen__summary">
          <p>Your response has been recorded.</p>
        </div>
      )}
    </div>
  );
}
