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
    <div className="rounded-xl border border-green-200 bg-green-50/50 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow-sm shadow-green-500/25">
          <Check className="h-4.5 w-4.5" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="font-semibold text-green-800">
            Submitted Successfully
          </h3>
          <p className="text-sm text-green-700/60">
            Data logged to browser console
          </p>
        </div>
      </div>

      <details className="mt-5 group">
        <summary className="cursor-pointer text-sm font-medium text-primary select-none hover:underline">
          View submitted JSON
        </summary>
        <pre className="mt-3 overflow-auto rounded-lg bg-neutral-900 text-neutral-300 p-4 text-xs leading-relaxed max-h-80 border border-neutral-800">
          {JSON.stringify(data.values, null, 2)}
        </pre>
      </details>

      <button
        onClick={onReset}
        className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground shadow-sm hover:bg-accent transition-colors duration-150 cursor-pointer"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Try Again
      </button>
    </div>
  );
}
