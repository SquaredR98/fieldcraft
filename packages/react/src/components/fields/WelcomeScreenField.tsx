import type { WelcomeScreenConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { Button } from "../ui/button";
import { cn } from "../../utils/cn";

export function WelcomeScreenField({ field }: FieldProps) {
  const config = field.config as WelcomeScreenConfig | undefined;

  if (!config) return null;

  const alignment = config.alignment ?? "center";
  const buttonText = config.buttonText ?? "Start";

  const handleStart = () => {
    const nextElement = document.querySelector('[data-question-index="1"]');
    if (nextElement) {
      nextElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className={cn(
        "fc-screen",
        alignment === "center" && "fc-screen--center",
        alignment === "right" && "fc-screen--right",
        alignment === "left" && "fc-screen--left",
      )}
    >
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

      <Button
        type="button"
        size="lg"
        onClick={handleStart}
        className="px-8 text-base font-semibold"
      >
        {buttonText}
      </Button>
    </div>
  );
}
