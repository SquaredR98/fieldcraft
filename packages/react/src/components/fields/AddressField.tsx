import type { AddressConfig } from "@squaredr/formengine-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { Input } from "../ui/input";

type AddressValue = {
  street?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

const DEFAULT_FIELDS: AddressConfig["fields"] = ["street", "city", "state", "zip", "country"];

export function AddressField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as AddressConfig | undefined;
  const addr = (value as AddressValue) ?? {};
  const fields = config?.fields ?? DEFAULT_FIELDS;

  const update = (part: string, val: string) => {
    onChange({ ...addr, [part]: val });
  };

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex flex-col gap-3">
        {fields!.includes("street") && (
          <Input
            id={`${field.id}-street`}
            type="text"
            placeholder="Street address"
            value={addr.street ?? ""}
            disabled={disabled}
            onChange={(e) => update("street", e.target.value)}
            onBlur={onBlur}
            autoComplete="address-line1"
          />
        )}
        {fields!.includes("street2") && (
          <Input
            id={`${field.id}-street2`}
            type="text"
            placeholder="Apt, suite, etc. (optional)"
            value={addr.street2 ?? ""}
            disabled={disabled}
            onChange={(e) => update("street2", e.target.value)}
            onBlur={onBlur}
            autoComplete="address-line2"
          />
        )}
        <div className="flex gap-3">
          {fields!.includes("city") && (
            <Input
              id={`${field.id}-city`}
              type="text"
              className="flex-1"
              placeholder="City"
              value={addr.city ?? ""}
              disabled={disabled}
              onChange={(e) => update("city", e.target.value)}
              onBlur={onBlur}
              autoComplete="address-level2"
            />
          )}
          {fields!.includes("state") && (
            <Input
              id={`${field.id}-state`}
              type="text"
              className="flex-1"
              placeholder="State / Province"
              value={addr.state ?? ""}
              disabled={disabled}
              onChange={(e) => update("state", e.target.value)}
              onBlur={onBlur}
              autoComplete="address-level1"
            />
          )}
          {fields!.includes("zip") && (
            <Input
              id={`${field.id}-zip`}
              type="text"
              className="w-32 shrink-0"
              placeholder="ZIP / Postal"
              value={addr.zip ?? ""}
              disabled={disabled}
              onChange={(e) => update("zip", e.target.value)}
              onBlur={onBlur}
              autoComplete="postal-code"
            />
          )}
        </div>
        {fields!.includes("country") && (
          <Input
            id={`${field.id}-country`}
            type="text"
            placeholder="Country"
            value={addr.country ?? config?.defaultCountry ?? ""}
            disabled={disabled}
            onChange={(e) => update("country", e.target.value)}
            onBlur={onBlur}
            autoComplete="country-name"
          />
        )}
      </div>
    </FieldWrapper>
  );
}
