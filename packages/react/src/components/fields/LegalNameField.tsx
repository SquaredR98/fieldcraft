import type { LegalNameConfig } from "@squaredr/formengine-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function LegalNameField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as LegalNameConfig | undefined;
  const hasError = !!(touched && error?.length);
  const nameValue = (value as { first?: string; middle?: string; last?: string }) ?? {};
  const showMiddle = config?.showMiddleName !== false;

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
            onChange={(e) => update("first", e.target.value)}
            onBlur={onBlur}
            autoComplete="given-name"
          />
        </div>
        {showMiddle && (
          <div className="flex flex-col gap-1.5 flex-1">
            <Label htmlFor={`${field.id}-middle`} className="text-xs">
              Middle name
            </Label>
            <Input
              id={`${field.id}-middle`}
              type="text"
              value={nameValue.middle ?? ""}
              disabled={disabled}
              onChange={(e) => update("middle", e.target.value)}
              onBlur={onBlur}
              autoComplete="additional-name"
            />
          </div>
        )}
        <div className="flex flex-col gap-1.5 flex-1">
          <Label htmlFor={`${field.id}-last`} className="text-xs">
            Last name
          </Label>
          <Input
            id={`${field.id}-last`}
            type="text"
            value={nameValue.last ?? ""}
            disabled={disabled}
            onChange={(e) => update("last", e.target.value)}
            onBlur={onBlur}
            autoComplete="family-name"
          />
        </div>
      </div>
    </FieldWrapper>
  );
}
