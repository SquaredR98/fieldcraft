import type { MatrixConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";

type MatrixValue = Record<string, string | string[]>;

export function MatrixField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as MatrixConfig | undefined;
  if (!config) return null;
  const { rows, columns, inputType = "radio" } = config;
  const matrix = (value as MatrixValue) ?? {};

  const updateCell = (rowValue: string, colValue: string) => {
    const next = { ...matrix };
    if (inputType === "checkbox") {
      const current = (next[rowValue] as string[]) ?? [];
      next[rowValue] = current.includes(colValue)
        ? current.filter((v) => v !== colValue)
        : [...current, colValue];
    } else {
      next[rowValue] = colValue;
    }
    onChange(next);
    onBlur();
  };

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="overflow-x-auto rounded-md border border-input" role="table" aria-label={field.label}>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-input bg-muted/50">
              <th className="p-3 text-left font-medium" />
              {columns.map((col) => (
                <th key={col.value} className="p-3 text-center font-medium text-foreground" scope="col">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.value} className={i < rows.length - 1 ? "border-b border-input" : ""}>
                <th className="p-3 text-left font-normal text-foreground" scope="row">
                  {row.label}
                </th>
                {columns.map((col) => {
                  const checked =
                    inputType === "checkbox"
                      ? ((matrix[row.value] as string[]) ?? []).includes(col.value)
                      : matrix[row.value] === col.value;
                  return (
                    <td key={col.value} className="p-3 text-center">
                      <input
                        type={inputType === "checkbox" ? "checkbox" : "radio"}
                        name={`${field.id}-${row.value}`}
                        checked={checked}
                        disabled={disabled}
                        onChange={() => updateCell(row.value, col.value)}
                        className="accent-primary h-4 w-4"
                        aria-label={`${row.label}: ${col.label}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FieldWrapper>
  );
}
