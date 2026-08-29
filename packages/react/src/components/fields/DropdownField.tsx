import { useState, useMemo } from "react";
import type { DropdownConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { cn } from "../../utils/cn";

const OTHER_VALUE = "__fc_other__";

export function DropdownField({ field, value, error, touched, disabled, readonly, onChange, onBlur, onFocus }: FieldProps) {
  const config = field.config as DropdownConfig | undefined;
  const options = field.options ?? [];
  const hasError = !!(touched && error?.length);
  const aria = fieldAria(field, hasError);
  const searchable = config?.searchable === true;
  const allowOther = config?.allowOther === true;
  const multiple = config?.multiple === true;

  if (multiple) {
    return (
      <MultiDropdown
        field={field}
        options={options}
        value={value}
        aria={aria}
        error={error}
        touched={touched}
        disabled={disabled}
        readonly={readonly}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    );
  }

  if (searchable) {
    return (
      <SearchableDropdown
        field={field}
        options={options}
        value={value as string | undefined}
        aria={aria}
        hasError={hasError}
        error={error}
        touched={touched}
        disabled={disabled}
        readonly={readonly}
        allowOther={allowOther}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    );
  }

  // Standard non-searchable Select
  const current = value !== undefined && value !== null && value !== "" ? String(value) : undefined;
  const isOtherSelected = allowOther && current != null && !options.some((o) => String(o.value) === current);

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <Select
        value={isOtherSelected ? OTHER_VALUE : current}
        onValueChange={(val) => {
          if (val === OTHER_VALUE) {
            onChange("");
          } else {
            onChange(val);
          }
        }}
        disabled={disabled || readonly}
      >
        <SelectTrigger
          id={aria.id}
          aria-describedby={aria["aria-describedby"]}
          aria-invalid={aria["aria-invalid"]}
          aria-required={aria["aria-required"]}
          className="w-full"
          onBlur={onBlur}
          onFocus={onFocus}
        >
          <SelectValue placeholder={field.placeholder ?? "Select..."} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </SelectItem>
          ))}
          {allowOther && (
            <SelectItem value={OTHER_VALUE}>Other...</SelectItem>
          )}
        </SelectContent>
      </Select>
      {isOtherSelected && (
        <Input
          type="text"
          value={current ?? ""}
          placeholder="Please specify..."
          className="mt-2"
          disabled={disabled || readonly}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          autoFocus
        />
      )}
    </FieldWrapper>
  );
}

function MultiDropdown({
  field,
  options,
  value,
  aria,
  error,
  touched,
  disabled,
  readonly,
  onChange,
  onBlur,
  onFocus,
}: {
  field: FieldProps["field"];
  options: NonNullable<FieldProps["field"]["options"]>;
  value: unknown;
  aria: ReturnType<typeof fieldAria>;
  error: FieldProps["error"];
  touched: FieldProps["touched"];
  disabled: boolean;
  readonly: boolean;
  onChange: FieldProps["onChange"];
  onBlur: FieldProps["onBlur"];
  onFocus: FieldProps["onFocus"];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selected = Array.isArray(value) ? (value as string[]) : [];

  const filtered = useMemo(() => {
    if (!search) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  const toggle = (optValue: string) => {
    const next = selected.includes(optValue)
      ? selected.filter((v) => v !== optValue)
      : [...selected, optValue];
    onChange(next);
  };

  const selectedLabels = selected
    .map((v) => options.find((o) => String(o.value) === v)?.label)
    .filter(Boolean);

  const summary = selectedLabels.length === 0
    ? (field.placeholder ?? "Select...")
    : selectedLabels.length <= 2
      ? selectedLabels.join(", ")
      : `${selectedLabels.length} selected`;

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setSearch(""); onBlur(); } }}>
        <PopoverTrigger asChild>
          <Button
            id={aria.id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-describedby={aria["aria-describedby"]}
            aria-invalid={aria["aria-invalid"]}
            aria-required={aria["aria-required"]}
            disabled={disabled || readonly}
            className={cn("w-full justify-between font-normal", selected.length === 0 && "text-muted-foreground")}
            onFocus={onFocus}
          >
            {summary}
            <svg className="ml-2 size-4 shrink-0 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
          <div className="p-2">
            <Input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 text-sm"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="p-2 text-sm text-muted-foreground text-center">No results.</p>
            )}
            {filtered.map((opt) => {
              const optVal = String(opt.value);
              const isChecked = selected.includes(optVal);
              return (
                <button
                  key={optVal}
                  type="button"
                  className="w-full px-3 py-2 text-sm text-left hover:bg-accent transition-colors flex items-center gap-2"
                  onClick={() => toggle(optVal)}
                >
                  <Checkbox checked={isChecked} tabIndex={-1} className="pointer-events-none" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  );
}

function SearchableDropdown({
  field,
  options,
  value,
  aria,
  hasError: _hasError,
  error,
  touched,
  disabled,
  readonly,
  allowOther,
  onChange,
  onBlur,
  onFocus,
}: {
  field: FieldProps["field"];
  options: NonNullable<FieldProps["field"]["options"]>;
  value: string | undefined;
  aria: ReturnType<typeof fieldAria>;
  hasError: boolean;
  error: FieldProps["error"];
  touched: FieldProps["touched"];
  disabled: boolean;
  readonly: boolean;
  allowOther: boolean;
  onChange: FieldProps["onChange"];
  onBlur: FieldProps["onBlur"];
  onFocus: FieldProps["onFocus"];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedLabel = options.find((o) => String(o.value) === value)?.label;
  const isOtherSelected = allowOther && value != null && !options.some((o) => String(o.value) === value);

  const filtered = useMemo(() => {
    if (!search) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={aria.id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-describedby={aria["aria-describedby"]}
            aria-invalid={aria["aria-invalid"]}
            aria-required={aria["aria-required"]}
            disabled={disabled || readonly}
            className={cn("w-full justify-between font-normal", !value && "text-muted-foreground")}
            onBlur={onBlur}
            onFocus={onFocus}
          >
            {isOtherSelected ? value : (selectedLabel ?? field.placeholder ?? "Select...")}
            <svg className="ml-2 size-4 shrink-0 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
          <div className="p-2">
            <Input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 text-sm"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 && !allowOther && (
              <p className="p-2 text-sm text-muted-foreground text-center">No results.</p>
            )}
            {filtered.map((opt) => {
              const isSelected = String(opt.value) === value;
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  className={cn(
                    "w-full px-3 py-2 text-sm text-left hover:bg-accent transition-colors flex items-center gap-2",
                    isSelected && "bg-accent font-medium",
                  )}
                  onClick={() => {
                    onChange(String(opt.value));
                    setOpen(false);
                    setSearch("");
                    onBlur();
                  }}
                >
                  <span className={cn("size-4 shrink-0", isSelected ? "opacity-100" : "opacity-0")}>✓</span>
                  {opt.label}
                </button>
              );
            })}
            {allowOther && (
              <button
                type="button"
                className={cn(
                  "w-full px-3 py-2 text-sm text-left hover:bg-accent transition-colors flex items-center gap-2 border-t",
                  isOtherSelected && "bg-accent font-medium",
                )}
                onClick={() => {
                  onChange(search || "");
                  setOpen(false);
                  setSearch("");
                }}
              >
                <span className={cn("size-4 shrink-0", isOtherSelected ? "opacity-100" : "opacity-0")}>✓</span>
                {search ? `Use "${search}"` : "Other..."}
              </button>
            )}
          </div>
        </PopoverContent>
      </Popover>
      {isOtherSelected && (
        <Input
          type="text"
          value={value ?? ""}
          placeholder="Please specify..."
          className="mt-2"
          disabled={disabled || readonly}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          autoFocus
        />
      )}
    </FieldWrapper>
  );
}
