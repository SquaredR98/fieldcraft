import type { LegalNameConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function LegalNameField({ field, value, error, touched, disabled, readonly, onChange, onBlur, onFocus }: FieldProps) {
  const config = field.config as LegalNameConfig | undefined;
  const hasError = !!(touched && error?.length);
  const nameValue = (value as { first?: string; middle?: string; last?: string; suffix?: string }) ?? {};
  const showMiddle = config?.showMiddleName !== false;
  const showSuffix = config?.showSuffix === true;

  const update = (part: string, val: string) => {
    onChange({ ...nameValue, [part]: val });
  };

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex gap-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <Label htmlFor={`${field.id}-first`} className="text-xs">
            First name
          </Label>
          <Input
            {...fieldAria(field, hasError)}
            id={`${field.id}-first`}
            type="text"
            value={nameValue.first ?? ""}
            disabled={disabled}
            readOnly={readonly}
            onChange={(e) => update("first", e.target.value)}
            onBlur={onBlur}
            onFocus={onFocus}
            autoComplete="given-name"
          />
        </div>
        {showMiddle && (
          <div className="flex flex-col gap-1.5 flex-1">
            <Label htmlFor={`${field.id}-middle`} className="text-xs">
              Middle name
            </Label>
            <Input
              {...fieldAria(field, hasError)}
              id={`${field.id}-middle`}
              type="text"
              value={nameValue.middle ?? ""}
              disabled={disabled}
              readOnly={readonly}
              onChange={(e) => update("middle", e.target.value)}
              onBlur={onBlur}
              onFocus={onFocus}
              autoComplete="additional-name"
            />
          </div>
        )}
        <div className="flex flex-col gap-1.5 flex-1">
          <Label htmlFor={`${field.id}-last`} className="text-xs">
            Last name
          </Label>
          <Input
            {...fieldAria(field, hasError)}
            id={`${field.id}-last`}
            type="text"
            value={nameValue.last ?? ""}
            disabled={disabled}
            readOnly={readonly}
            onChange={(e) => update("last", e.target.value)}
            onBlur={onBlur}
            onFocus={onFocus}
            autoComplete="family-name"
          />
        </div>
        {showSuffix && (
          <div className="flex flex-col gap-1.5 w-24">
            <Label htmlFor={`${field.id}-suffix`} className="text-xs">
              Suffix
            </Label>
            <Input
              {...fieldAria(field, hasError)}
              id={`${field.id}-suffix`}
              type="text"
              placeholder="Jr., Sr., III"
              value={nameValue.suffix ?? ""}
              disabled={disabled}
              readOnly={readonly}
              onChange={(e) => update("suffix", e.target.value)}
              onBlur={onBlur}
              onFocus={onFocus}
              autoComplete="honorific-suffix"
            />
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}
