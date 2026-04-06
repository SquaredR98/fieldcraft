import { useRef } from "react";
import type { FileUploadConfig } from "@squaredr/formengine-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { formatFileSize } from "../../utils/format-helpers";
import { cn } from "../../utils/cn";
import { Button } from "../ui/button";

type FileEntry = { name: string; size: number; type: string };

export function FileUploadField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as FileUploadConfig | undefined;
  const files = (value as FileEntry[]) ?? [];
  const inputRef = useRef<HTMLInputElement>(null);
  const maxFiles = config?.maxFiles ?? 1;
  const accept = config?.accept?.join(",");

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: FileEntry[] = Array.from(fileList).map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
    }));
    const merged = [...files, ...newFiles].slice(0, maxFiles);
    onChange(merged);
    onBlur();
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div
        className={cn(
          "flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-input p-6 transition-colors",
          !disabled && "hover:border-ring hover:bg-accent/50",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={maxFiles > 1}
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
          aria-label={field.label}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || files.length >= maxFiles}
          onClick={() => inputRef.current?.click()}
        >
          Choose file{maxFiles > 1 ? "s" : ""}
        </Button>
        <p className="text-xs text-muted-foreground">
          or drag and drop
          {config?.maxSizeMb ? ` (max ${config.maxSizeMb}MB)` : ""}
        </p>
      </div>

      {files.length > 0 && (
        <ul className="flex flex-col gap-1 mt-2 list-none p-0 m-0">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center gap-2 text-sm rounded-md border border-input px-3 py-1.5">
              <span className="flex-1 truncate">{f.name}</span>
              <span className="text-xs text-muted-foreground shrink-0">{formatFileSize(f.size)}</span>
              <button
                type="button"
                className="text-muted-foreground hover:text-destructive transition-colors shrink-0 p-0.5"
                onClick={() => removeFile(i)}
                aria-label={`Remove ${f.name}`}
                disabled={disabled}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </FieldWrapper>
  );
}
