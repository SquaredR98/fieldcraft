import { useState } from "react";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import type { DateRangeConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper, fieldAria } from "./FieldWrapper";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "../../utils/cn";

export function DateRangeField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as DateRangeConfig | undefined;
  const hasError = !!(touched && error?.length);
  const [open, setOpen] = useState(false);

  const range = (value as { start?: string; end?: string }) ?? {};

  const startDate = range.start ? parse(range.start, "yyyy-MM-dd", new Date()) : undefined;
  const endDate = range.end ? parse(range.end, "yyyy-MM-dd", new Date()) : undefined;
  const validStart = startDate && isValid(startDate) ? startDate : undefined;
  const validEnd = endDate && isValid(endDate) ? endDate : undefined;

  const selected: DateRange | undefined =
    validStart || validEnd ? { from: validStart, to: validEnd } : undefined;

  const disabledDates = (date: Date): boolean => {
    if (config?.minDate) {
      const min = parse(config.minDate, "yyyy-MM-dd", new Date());
      if (isValid(min) && date < min) return true;
    }
    if (config?.maxDate) {
      const max = parse(config.maxDate, "yyyy-MM-dd", new Date());
      if (isValid(max) && date > max) return true;
    }
    return false;
  };

  const formatDisplay = () => {
    if (validStart && validEnd) {
      return `${format(validStart, "PPP")} – ${format(validEnd, "PPP")}`;
    }
    if (validStart) {
      return `${format(validStart, "PPP")} – ...`;
    }
    return field.placeholder ?? "Pick a date range";
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
              !selected && "text-muted-foreground"
            )}
            onBlur={onBlur}
          >
            <CalendarIcon className="mr-2 size-4" />
            {formatDisplay()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            captionLayout="dropdown"
            startMonth={new Date(new Date().getFullYear() - 10, 0)}
            endMonth={new Date(new Date().getFullYear() + 10, 11)}
            selected={selected}
            onSelect={(range) => {
              onChange({
                start: range?.from ? format(range.from, "yyyy-MM-dd") : undefined,
                end: range?.to ? format(range.to, "yyyy-MM-dd") : undefined,
              });
              // Close popover when both dates are selected
              if (range?.from && range?.to) {
                setOpen(false);
              }
            }}
            disabled={disabledDates}
            defaultMonth={validStart}
            numberOfMonths={2}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  );
}
