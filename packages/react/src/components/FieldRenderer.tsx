import type { Question, FormEngineTheme } from "@squaredr/fieldcraft-core";
import type { FieldRegistry } from "../registry/field-registry";
import { cn } from "../utils/cn";

export type FieldRendererProps = {
  field: Question;
  value: unknown;
  error?: string[];
  touched: boolean;
  disabled: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  theme: FormEngineTheme;
  registry: FieldRegistry;
};

const widthMap: Record<string, string> = {
  half: "w-1/2",
  third: "w-1/3",
};

export function FieldRenderer({
  field,
  value,
  error,
  touched,
  disabled,
  onChange,
  onBlur,
  theme,
  registry,
}: FieldRendererProps) {
  const Component = registry[field.type];

  if (!Component) {
    return (
      <div className="rounded-md border border-destructive p-3" role="alert">
        <p className="text-sm text-destructive">
          Unsupported field type: <code>{field.type}</code>
        </p>
      </div>
    );
  }

  const widthClass = widthMap[field.layout?.width as string] ?? "w-full";

  return (
    <div
      className={cn(widthClass)}
      data-field-id={field.id}
    >
      <Component
        field={field}
        value={value}
        error={error}
        touched={touched}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        theme={theme}
      />
    </div>
  );
}
