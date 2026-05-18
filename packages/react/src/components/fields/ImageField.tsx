import type { ImageConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";

export function ImageField({ field }: FieldProps) {
  const config = field.config as ImageConfig | undefined;

  if (!config?.src) return null;

  const alignment = config.alignment ?? "center";
  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent:
      alignment === "center" ? "center" : alignment === "right" ? "flex-end" : "flex-start",
    padding: "1rem 0",
  };

  const ImageElement = (
    <img
      src={config.src}
      alt={config.alt}
      style={{
        maxWidth: "100%",
        height: "auto",
        width: config.width ?? "100%",
        ...(config.height ? { height: config.height } : {}),
        borderRadius: "4px",
      }}
      loading="lazy"
    />
  );

  const content = config.link ? (
    <a
      href={config.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: "inline-block" }}
    >
      {ImageElement}
    </a>
  ) : (
    ImageElement
  );

  return (
    <figure style={containerStyle}>
      <div style={{ maxWidth: config.width ?? "100%" }}>
        {content}
        {config.caption && (
          <figcaption
            style={{
              marginTop: "0.5rem",
              fontSize: "0.875rem",
              color: "rgba(0, 0, 0, 0.6)",
              textAlign: alignment,
            }}
          >
            {config.caption}
          </figcaption>
        )}
      </div>
    </figure>
  );
}
