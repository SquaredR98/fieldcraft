import { useState } from "react";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "../../utils/cn";

export function DateField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as DateConfig | undefined;
  const hasError = !!(touched && error?.length);
  const [open, setOpen] = useState(false);

  const strValue = (value as string) ?? "";
  const selected = strValue ? parse(strValue, "yyyy-MM-dd", new Date()) : undefined;
  const validSelected = selected && isValid(selected) ? selected : undefined;

  const disabledDates = (date: Date): boolean => {
    if (config?.minDate) {
      const min = parse(config.minDate, "yyyy-MM-dd", new Date());
      if (isValid(min) && date < min) return true;
    }
    if (config?.maxDate) {
      const max = parse(config.maxDate, "yyyy-MM-dd", new Date());
      if (isValid(max) && date > max) return true;
    }
    if (config?.disablePast) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) return true;
    }
    if (config?.disableFuture) {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (date > today) return true;
    }
    return false;
  };

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            {...fieldAria(field, hasError)}
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !validSelected && "text-muted-foreground"
            )}
            onBlur={onBlur}
          >
            <CalendarIcon className="mr-2 size-4" />
            {validSelected ? format(validSelected, "PPP") : (field.placeholder ?? "Pick a date")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            startMonth={new Date(new Date().getFullYear() - 100, 0)}
            endMonth={new Date(new Date().getFullYear() + 10, 11)}
            selected={validSelected}
            onSelect={(date) => {
              onChange(date ? format(date, "yyyy-MM-dd") : undefined);
              setOpen(false);
            }}
            disabled={disabledDates}
            defaultMonth={validSelected}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  );
}
