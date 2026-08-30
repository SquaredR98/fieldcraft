import { useEffect } from "react";
import type { ThankYouScreenConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";

export function ThankYouScreenField({ field, value: _value, error: _error, touched: _touched, disabled: _disabled, readonly: _readonly, onChange: _onChange, onBlur: _onBlur, onFocus: _onFocus }: FieldProps) {
  const config = field.config as ThankYouScreenConfig | undefined;
  const redirectUrl = config?.redirectUrl;
  const redirectDelay = config?.redirectDelay;

  // Handle redirect if configured
  useEffect(() => {
    if (redirectUrl && redirectDelay !== undefined && redirectDelay > 0) {
      const timer = setTimeout(() => {
        window.location.href = redirectUrl;
      }, redirectDelay * 1000);

      return () => clearTimeout(timer);
    }
  }, [redirectUrl, redirectDelay]);

  if (!config) return null;

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
