import { useState } from "react";
import type { AppointmentConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { cn } from "../../utils/cn";

export function AppointmentField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as AppointmentConfig | undefined;
  const slots = config?.slots ?? [];
  const selected = value as { date?: string; time?: string } | undefined;
  const [selectedDate, setSelectedDate] = useState<string | undefined>(selected?.date);

  const timesForDate = slots.find((s) => s.date === selectedDate)?.times ?? [];

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-foreground">Select a date</p>
          <div className="flex flex-wrap gap-2" role="listbox" aria-label="Available dates">
            {slots.map((slot) => (
              <button
                key={slot.date}
                type="button"
                role="option"
                aria-selected={selectedDate === slot.date}
                className={cn(
                  "px-3 py-2 rounded-md border text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                  selectedDate === slot.date
                    ? "fe-option-active"
                    : "border-input hover:bg-accent",
                )}
                disabled={disabled}
                onClick={() => {
                  setSelectedDate(slot.date);
                  onChange({ date: slot.date, time: undefined });
                }}
              >
                {slot.date}
              </button>
            ))}
          </div>
        </div>

        {selectedDate && timesForDate.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-foreground">Select a time</p>
            <div className="flex flex-wrap gap-2" role="listbox" aria-label="Available times">
              {timesForDate.map((time) => (
                <button
                  key={time}
                  type="button"
                  role="option"
                  aria-selected={selected?.time === time}
                  className={cn(
                    "px-3 py-2 rounded-md border text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                    selected?.time === time
                      ? "fe-option-active"
                      : "border-input hover:bg-accent",
                  )}
                  disabled={disabled}
                  onClick={() => {
                    onChange({ date: selectedDate, time });
                    onBlur();
                  }}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}
