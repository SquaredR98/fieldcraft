import { useState, useCallback } from "react";
import type { AppointmentConfig, AppointmentSlot } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "../../utils/cn";

type AppointmentValue = {
  date?: string;
  time?: string;
  timezone?: string;
  status?: string;
  bookingId?: string;
  [key: string]: unknown;
};

function formatDateLabel(dateStr: string, timezone?: string): string {
  try {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: timezone,
    });
  } catch {
    return dateStr;
  }
}

export function AppointmentField({
  field,
  value,
  error,
  touched,
  disabled,
  readonly,
  onChange,
  onBlur,
  onFocus,
  customProps,
  fieldValues,
}: FieldProps) {
  const config = field.config as AppointmentConfig | undefined;
  const selected = value as AppointmentValue | undefined;

  // Resolve timezone
  let timezone: string | undefined = config?.timezone;
  if (typeof customProps?.timezone === "string" && customProps.timezone) {
    timezone = customProps.timezone;
  } else if (config?.timezoneField && fieldValues && typeof fieldValues[config.timezoneField] === "string") {
    timezone = fieldValues[config.timezoneField] as string;
  } else if (!timezone) {
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      timezone = undefined;
    }
  }

  const slots: AppointmentSlot[] = config?.slots ?? [];
  const [activeDate, setActiveDate] = useState<string | null>(() => {
    if (selected?.date) return selected.date;
    return slots.length > 0 ? slots[0].date : null;
  });

  const handleDateSelect = useCallback((date: string) => {
    setActiveDate(date);
    onFocus?.();
  }, [onFocus]);

  const handleTimeSelect = useCallback((time: string) => {
    if (!activeDate || disabled || readonly) return;
    onChange({
      date: activeDate,
      time,
      timezone,
      status: "confirmed",
    });
    onBlur();
  }, [activeDate, disabled, readonly, onChange, onBlur, timezone]);

  const currentSlot = slots.find((s) => s.date === activeDate);

  if (slots.length === 0) {
    return (
      <FieldWrapper field={field} error={error} touched={touched}>
        <div className="rounded-lg border border-dashed border-input bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            No appointment slots configured. Provide <code className="text-xs bg-muted px-1 rounded">slots</code> in the schema, or register a custom provider override.
          </p>
        </div>
      </FieldWrapper>
    );
  }

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex flex-col gap-3">
        {/* Header Badges: Duration & Timezone */}
        <div className="flex flex-wrap items-center gap-2">
          {config?.duration && (
            <Badge variant="outline" className="gap-1 text-xs font-normal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={12} height={12}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {config.duration} min
            </Badge>
          )}
          {timezone && (
            <Badge variant="secondary" className="text-xs font-normal">
              {timezone}
            </Badge>
          )}
        </div>

        {/* Date Selection Buttons */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Available appointment dates">
          {slots.map((slot) => {
            const isSelected = activeDate === slot.date;
            return (
              <Button
                key={slot.date}
                type="button"
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={cn("text-xs font-medium", isSelected && "shadow-sm")}
                disabled={disabled || readonly}
                onClick={() => handleDateSelect(slot.date)}
              >
                {formatDateLabel(slot.date, timezone)}
              </Button>
            );
          })}
        </div>

        {/* Time Selection Buttons for Active Date */}
        {currentSlot && currentSlot.times.length > 0 && (
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-xs text-muted-foreground font-medium">Available Times</span>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2" role="group" aria-label="Available appointment times">
              {currentSlot.times.map((time: string) => {
                const isSelected = selected?.date === activeDate && selected?.time === time;
                return (
                  <Button
                    key={time}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={cn("text-xs", isSelected && "ring-2 ring-primary ring-offset-1")}
                    disabled={disabled || readonly}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Confirmation Preview */}
        {selected?.date && selected?.time && (
          <div className="rounded-md border border-input bg-muted/40 px-3 py-2 text-xs flex items-center justify-between">
            <span className="text-foreground font-medium">
              Selected: {formatDateLabel(selected.date, timezone)} at {selected.time}
            </span>
            <Badge variant="default" className="text-[10px] uppercase">
              Confirmed
            </Badge>
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}
