import type { WelcomeScreenConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";

export function WelcomeScreenField({ field }: FieldProps) {
  const config = field.config as WelcomeScreenConfig | undefined;

  if (!config) return null;

  const alignment = config.alignment ?? "center";
  const buttonText = config.buttonText ?? "Start";

  const handleStart = () => {
    // Scroll to next question or trigger section navigation
    // This would be wired up via the form engine context in a real implementation
    const nextElement = document.querySelector('[data-question-index="1"]');
    if (nextElement) {
      nextElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: alignment === "center" ? "center" : alignment === "right" ? "flex-end" : "flex-start",
        textAlign: alignment,
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

      <button
        type="button"
        onClick={handleStart}
        style={{
          backgroundColor: "#0066cc",
          color: "white",
          padding: "0.75rem 2rem",
          fontSize: "1rem",
          fontWeight: "600",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#0052a3";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#0066cc";
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}
