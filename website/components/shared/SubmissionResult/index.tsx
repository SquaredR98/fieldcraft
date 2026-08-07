"use client";

import { Check, RotateCcw } from "lucide-react";
import type { FormResponse } from "@squaredr/fieldcraft-core";

export function SubmissionResult({
  data,
  onReset,
}: {
  data: FormResponse;
  onReset: () => void;
}) {
  return (
    <div className="border border-fc-teal-border bg-fc-wash p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-fc-teal text-fc-teal-on">
          <Check className="h-4.5 w-4.5" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="font-semibold text-fc-ink-strong">
            Submitted Successfully
          </h3>
          <p className="text-sm text-fc-muted">
            Data logged to browser console
          </p>
        </div>
      </div>

      <details className="mt-5 group">
        <summary className="cursor-pointer text-sm font-medium text-fc-teal select-none hover:underline">
          View submitted JSON
        </summary>
        <pre className="mt-3 overflow-auto bg-fc-surface text-fc-ink p-4 text-xs font-mono leading-relaxed max-h-80 border border-fc-rule">
          {JSON.stringify(data.values, null, 2)}
        </pre>
      </details>

      <button
        onClick={onReset}
        className="mt-5 inline-flex h-9 items-center gap-2 border border-fc-rule bg-fc-surface px-4 text-sm font-medium text-fc-ink-strong hover:bg-fc-surface2 transition-colors duration-150 cursor-pointer"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Try Again
      </button>
    </div>
  );
}
