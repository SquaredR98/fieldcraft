import { useState, useEffect, useCallback, useRef } from "react";
import type { AppointmentConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { cn } from "../../utils/cn";

type Slot = { date: string; times: string[] };
type AppointmentValue = { date?: string; time?: string; timezone?: string; bookingId?: string };
type FetchSlotsCallback = (params: { date?: string; timezone?: string }) => Promise<{ slots: Slot[] }>;
type BookSlotCallback = (params: { date: string; time: string; timezone?: string }) => Promise<{ confirmed: boolean; bookingId?: string }>;

type Mode = "callback" | "embed" | "url" | "static" | "setup";

function resolveMode(config: AppointmentConfig | undefined, customProps: Record<string, unknown> | undefined): Mode {
  if (customProps?.onFetchSlots) return "callback";
  if (config?.embedUrl) return "embed";
  if (config?.slotsUrl) return "url";
  if (config?.slots && config.slots.length > 0) return "static";
  return "setup";
}

function formatDate(dateStr: string, _dateFormat?: string, timezone?: string): string {
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

export function AppointmentField({ field, value, error, touched, disabled, readonly, onChange, onBlur, onFocus, customProps }: FieldProps) {
  const config = field.config as AppointmentConfig | undefined;
  const mode = resolveMode(config, customProps);
  const selected = value as AppointmentValue | undefined;

  if (mode === "setup") {
    return (
      <FieldWrapper field={field} error={error} touched={touched}>
        <div className="rounded-lg border border-dashed border-input bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            No appointment slots configured. Provide <code className="text-xs bg-muted px-1 rounded">slots</code>, <code className="text-xs bg-muted px-1 rounded">slotsUrl</code>, <code className="text-xs bg-muted px-1 rounded">embedUrl</code>, or a <code className="text-xs bg-muted px-1 rounded">customProps.onFetchSlots</code> callback.
          </p>
        </div>
      </FieldWrapper>
    );
  }

  if (mode === "embed") {
    return (
      <EmbedMode
        field={field}
        config={config!}
        value={selected}
        error={error}
        touched={touched}
        onChange={onChange}
      />
    );
  }

  return (
    <SlotPickerMode
      field={field}
      config={config}
      mode={mode}
      value={selected}
      error={error}
      touched={touched}
      disabled={disabled}
      readonly={readonly}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      customProps={customProps}
    />
  );
}

// ── Embed Mode ──

function EmbedMode({
  field,
  config,
  value,
  error,
  touched,
  onChange,
}: {
  field: FieldProps["field"];
  config: AppointmentConfig;
  value: AppointmentValue | undefined;
  error: FieldProps["error"];
  touched: FieldProps["touched"];
  onChange: FieldProps["onChange"];
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      try {
        const provider = config.embedProvider ?? "custom";

        if (provider === "calendly") {
          // Calendly sends { event: "calendly.event_scheduled", payload: { event: { uri } } }
          if (e.data?.event === "calendly.event_scheduled") {
            const uri = e.data?.payload?.event?.uri;
            onChange({
              ...value,
              bookingId: uri ?? "calendly-booked",
              date: new Date().toISOString().split("T")[0],
              time: new Date().toISOString().split("T")[1]?.slice(0, 5),
            });
          }
        } else if (provider === "cal_com") {
          // Cal.com sends { type: "Cal:event", data: { ... } }
          if (e.data?.type === "Cal:event" || e.data?.event === "booking_created") {
            onChange({
              ...value,
              bookingId: e.data?.data?.bookingId ?? "cal-booked",
              date: e.data?.data?.date ?? new Date().toISOString().split("T")[0],
              time: e.data?.data?.startTime ?? "",
            });
          }
        } else {
          // Custom provider — expects { type: "appointment_booked", date, time, bookingId }
          if (e.data?.type === "appointment_booked") {
            onChange({
              date: e.data.date,
              time: e.data.time,
              bookingId: e.data.bookingId,
              timezone: config.timezone,
            });
          }
        }
      } catch {
        // Ignore malformed messages
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [config.embedProvider, config.timezone, onChange, value]);

  const confirmed = !!value?.bookingId;

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex flex-col gap-2">
        {config.duration && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={14} height={14}>
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {config.duration} min
          </span>
        )}
        {confirmed ? (
          <div className="rounded-lg border border-input bg-muted/50 p-4">
            <p className="text-sm text-foreground font-medium">Appointment booked</p>
            {value?.date && <p className="text-xs text-muted-foreground mt-1">{value.date} {value.time && `at ${value.time}`}</p>}
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={config.embedUrl}
            className="w-full rounded-md border border-input"
            style={{ minHeight: 600 }}
            title={`${field.label} booking`}
            allow="payment"
          />
        )}
      </div>
    </FieldWrapper>
  );
}

// ── Slot Picker Mode (callback, URL, or static) ──

function SlotPickerMode({
  field,
  config,
  mode,
  value,
  error,
  touched,
  disabled,
  readonly,
  onChange,
  onBlur,
  onFocus,
  customProps,
}: {
  field: FieldProps["field"];
  config: AppointmentConfig | undefined;
  mode: "callback" | "url" | "static";
  value: AppointmentValue | undefined;
  error: FieldProps["error"];
  touched: FieldProps["touched"];
  disabled: boolean;
  readonly: boolean;
  onChange: FieldProps["onChange"];
  onBlur: FieldProps["onBlur"];
  onFocus: FieldProps["onFocus"];
  customProps: FieldProps["customProps"];
}) {
  const [slots, setSlots] = useState<Slot[]>(mode === "static" ? (config?.slots ?? []) : []);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(value?.date);
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const onFetchSlots = customProps?.onFetchSlots as FetchSlotsCallback | undefined;
  const onBookSlot = customProps?.onBookSlot as BookSlotCallback | undefined;

  // Fetch slots on mount (callback or URL mode)
  useEffect(() => {
    if (mode === "static") return;

    const fetchSlots = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        if (mode === "callback" && onFetchSlots) {
          const result = await onFetchSlots({ timezone: config?.timezone });
          setSlots(result.slots ?? []);
        } else if (mode === "url" && config?.slotsUrl) {
          const url = new URL(config.slotsUrl);
          if (config?.timezone) url.searchParams.set("timezone", config.timezone);
          const res = await fetch(url.toString());
          if (!res.ok) throw new Error(`Failed to fetch slots (${res.status})`);
          const data = await res.json();
          setSlots(data.slots ?? []);
        }
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : "Failed to load slots");
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [mode, config?.slotsUrl, config?.timezone, onFetchSlots]);

  // Fetch times for selected date (callback or URL mode)
  const fetchTimesForDate = useCallback(async (date: string) => {
    if (mode === "static") return;
    setLoading(true);
    setFetchError(null);
    try {
      if (mode === "callback" && onFetchSlots) {
        const result = await onFetchSlots({ date, timezone: config?.timezone });
        setSlots((prev) => {
          const others = prev.filter((s) => s.date !== date);
          const newSlot = result.slots?.find((s) => s.date === date);
          return newSlot ? [...others, newSlot] : others;
        });
      } else if (mode === "url" && config?.slotsUrl) {
        const url = new URL(config.slotsUrl);
        url.searchParams.set("date", date);
        if (config?.timezone) url.searchParams.set("timezone", config.timezone);
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`Failed to fetch times (${res.status})`);
        const data = await res.json();
        setSlots((prev) => {
          const others = prev.filter((s) => s.date !== date);
          const newSlot = data.slots?.find((s: Slot) => s.date === date);
          return newSlot ? [...others, newSlot] : others;
        });
      }
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load times");
    } finally {
      setLoading(false);
    }
  }, [mode, config?.slotsUrl, config?.timezone, onFetchSlots]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setBookingError(null);
    onChange({ date, time: undefined, timezone: config?.timezone });
    if (mode !== "static") {
      fetchTimesForDate(date);
    }
  };

  const handleTimeSelect = async (time: string) => {
    const newValue: AppointmentValue = { date: selectedDate, time, timezone: config?.timezone };

    if (onBookSlot && selectedDate) {
      setBooking(true);
      setBookingError(null);
      try {
        const result = await onBookSlot({ date: selectedDate, time, timezone: config?.timezone });
        if (result.confirmed) {
          newValue.bookingId = result.bookingId;
        } else {
          setBookingError("Booking was not confirmed. Please try another slot.");
          return;
        }
      } catch (err) {
        setBookingError(err instanceof Error ? err.message : "Booking failed");
        return;
      } finally {
        setBooking(false);
      }
    }

    onChange(newValue);
    onBlur();
  };

  const timesForDate = slots.find((s) => s.date === selectedDate)?.times ?? [];

  if (loading && slots.length === 0) {
    return (
      <FieldWrapper field={field} error={error} touched={touched}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground p-4">
          <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20" />
          </svg>
          Loading available slots...
        </div>
      </FieldWrapper>
    );
  }

  if (fetchError && slots.length === 0) {
    return (
      <FieldWrapper field={field} error={error} touched={touched}>
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">{fetchError}</p>
          <button
            type="button"
            className="mt-2 text-xs text-primary hover:underline"
            onClick={() => {
              setFetchError(null);
              if (mode === "callback" && onFetchSlots) {
                setLoading(true);
                onFetchSlots({ timezone: config?.timezone })
                  .then((r) => setSlots(r.slots ?? []))
                  .catch((e) => setFetchError(e.message))
                  .finally(() => setLoading(false));
              }
            }}
          >
            Retry
          </button>
        </div>
      </FieldWrapper>
    );
  }

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex flex-col gap-4">
        {config?.duration && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={14} height={14}>
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {config.duration} min
          </span>
        )}

        {/* Date selection */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-foreground">Select a date</p>
          {slots.length === 0 ? (
            <p className="text-sm text-muted-foreground">No appointment slots available</p>
          ) : (
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
                      ? "fc-option-active"
                      : "border-input hover:bg-accent",
                  )}
                  disabled={disabled || readonly || booking}
                  onFocus={onFocus}
                  onClick={() => handleDateSelect(slot.date)}
                >
                  {formatDate(slot.date, config?.dateFormat, config?.timezone)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Time selection */}
        {selectedDate && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-foreground">Select a time</p>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading times...</p>
            ) : timesForDate.length === 0 ? (
              <p className="text-sm text-muted-foreground">No available times for this date</p>
            ) : (
              <div className="flex flex-wrap gap-2" role="listbox" aria-label="Available times">
                {timesForDate.map((time) => (
                  <button
                    key={time}
                    type="button"
                    role="option"
                    aria-selected={value?.time === time}
                    className={cn(
                      "px-3 py-2 rounded-md border text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                      (value as AppointmentValue)?.time === time
                        ? "fc-option-active"
                        : "border-input hover:bg-accent",
                    )}
                    disabled={disabled || readonly || booking}
                    onFocus={onFocus}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Booking status */}
        {booking && (
          <p className="text-sm text-muted-foreground">Confirming your booking...</p>
        )}
        {bookingError && (
          <p className="text-sm text-destructive">{bookingError}</p>
        )}
        {value?.bookingId && (
          <div className="rounded-md bg-muted/50 border border-input p-3">
            <p className="text-sm text-foreground font-medium">Booking confirmed</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatDate(value.date!, config?.dateFormat, config?.timezone)} at {value.time}
            </p>
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}
