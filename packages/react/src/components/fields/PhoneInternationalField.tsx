import type { PhoneInternationalConfig } from "@squaredr/formengine-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";
import { Input } from "../ui/input";

export function PhoneInternationalField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as PhoneInternationalConfig | undefined;
  const hasError = !!(touched && error?.length);
  const phoneValue = (value as { countryCode?: string; number?: string }) ?? {};

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex gap-2">
        <select
          className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 w-32 shrink-0"
          value={phoneValue.countryCode ?? config?.defaultCountry ?? "US"}
          disabled={disabled}
          onChange={(e) =>
            onChange({ ...phoneValue, countryCode: e.target.value })
          }
          aria-label="Country code"
        >
          <option value="US">+1 (US)</option>
          <option value="GB">+44 (UK)</option>
          <option value="CA">+1 (CA)</option>
          <option value="AU">+61 (AU)</option>
          <option value="DE">+49 (DE)</option>
          <option value="FR">+33 (FR)</option>
          <option value="IN">+91 (IN)</option>
          <option value="JP">+81 (JP)</option>
        </select>
        <Input
          {...fieldAria(field, hasError)}
          type="tel"
          value={phoneValue.number ?? ""}
          placeholder={field.placeholder}
          disabled={disabled}
          onChange={(e) =>
            onChange({ ...phoneValue, number: e.target.value })
          }
          onBlur={onBlur}
        />
      </div>
    </FieldWrapper>
  );
}
