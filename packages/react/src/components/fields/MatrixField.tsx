import type { MatrixConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";

type MatrixValue = Record<string, string | string[]>;

export function MatrixField({ field, value, error, touched, disabled, readonly, onChange, onBlur, onFocus }: FieldProps) {
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
      <div className="overflow-x-auto rounded-md border border-input" role="region" aria-label={field.label}>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-1/3" />
              {columns.map((col) => (
                <TableHead key={col.value} className="text-center font-medium">
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.value}>
                <TableCell className="font-medium text-foreground">
                  {row.label}
                </TableCell>
                {columns.map((col) => {
                  const checked =
                    inputType === "checkbox"
                      ? ((matrix[row.value] as string[]) ?? []).includes(col.value)
                      : matrix[row.value] === col.value;
                  return (
                    <TableCell key={col.value} className="text-center">
                      <input
                        type={inputType === "checkbox" ? "checkbox" : "radio"}
                        name={`${field.id}-${row.value}`}
                        checked={checked}
                        disabled={disabled || readonly}
                        onChange={() => updateCell(row.value, col.value)}
                        onFocus={onFocus}
                        className="accent-primary h-4 w-4 cursor-pointer disabled:cursor-not-allowed"
                        aria-label={`${row.label}: ${col.label}`}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </FieldWrapper>
  );
}
