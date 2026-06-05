import type { ImageConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { cn } from "../../utils/cn";

export function ImageField({ field }: FieldProps) {
  const config = field.config as ImageConfig | undefined;

  if (!config?.src) return null;

  const alignment = config.alignment ?? "center";

  const ImageElement = (
    <img
      src={config.src}
      alt={config.alt}
      className="fc-image__img"
      style={{
        width: config.width ?? "100%",
        ...(config.height ? { height: config.height } : {}),
      }}
      loading="lazy"
    />
  );

  const content = config.link ? (
    <a href={config.link} target="_blank" rel="noopener noreferrer" className="inline-block">
      {ImageElement}
    </a>
  ) : (
    ImageElement
  );

  return (
    <figure
      className={cn(
        "fc-image",
        alignment === "center" && "fc-image--center",
        alignment === "right" && "fc-image--right",
        alignment === "left" && "fc-image--left",
      )}
    >
      <div style={{ maxWidth: config.width ?? "100%" }}>
        {content}
        {config.caption && (
          <figcaption
            className={cn(
              "fc-image__caption",
              alignment === "center" && "text-center",
              alignment === "right" && "text-right",
              alignment === "left" && "text-left",
            )}
          >
            {config.caption}
          </figcaption>
        )}
      </div>
    </figure>
  );
}
