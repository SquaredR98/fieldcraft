import type { WelcomeScreenConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { Button } from "../ui/button";
import { cn } from "../../utils/cn";
import { useFormActions } from "../FormActionsContext";

export function WelcomeScreenField({
  field,
  value: _value,
  error: _error,
  touched: _touched,
  disabled: _disabled,
  readonly: _readonly,
  onChange: _onChange,
  onBlur: _onBlur,
  onFocus: _onFocus,
}: FieldProps) {
  const config = field.config as WelcomeScreenConfig | undefined;
  const { advance, atEnd } = useFormActions();

  if (!config) return null;

  const alignment = config.alignment ?? "center";
  const buttonText = config.buttonText ?? "Start";

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
        <img src={config.imageUrl} alt={config.imageAlt ?? ""} className="fc-screen__image" />
      )}

      <h2 className="fc-screen__heading">{config.heading}</h2>

      {config.description && <p className="fc-screen__description">{config.description}</p>}

      {/* Advances through the engine, not the DOM.

          This button used to call
          `document.querySelector('[data-question-index="1"]')` and scroll to
          the result — but that attribute existed nowhere in the package, so
          the query always returned null and the button did nothing at all
          (`REACT-13`). Reaching into the DOM was the deeper mistake: it could
          not work in stepped mode, where the next question is not yet
          rendered.

          Hidden only when the form explicitly says there is nowhere to go:
          `atEnd === true`. That is the case in classic mode, where every
          question is already on screen and a Start button would do nothing
          however it was wired.

          Deliberately NOT hidden when the context is absent (`atEnd ===
          undefined`). This component is a public export, and a consumer who
          renders it standalone — in their own layout, or a visual test —
          should still see the button they configured. It is inert there, but
          invisible is worse than inert: a silently missing button looks like
          the component is broken. */}
      {atEnd !== true && (
        <Button
          size="lg"
          onClick={advance}
          className="px-8 text-base font-semibold"
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
}
