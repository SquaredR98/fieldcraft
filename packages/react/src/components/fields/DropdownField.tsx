import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";

export function DropdownField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const options = field.options ?? [];
  const hasError = !!(touched && error?.length);

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <select
        {...fieldAria(field, hasError)}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive"
        value={(value as string) ?? ""}
        disabled={disabled}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val === "" ? undefined : val);
        }}
        onBlur={onBlur}
      >
        <option value="">
          {field.placeholder ?? "Select..."}
        </option>
        {options.map((opt) => (
          <option key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
