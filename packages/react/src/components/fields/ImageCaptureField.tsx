import { useRef } from "react";
import type { ImageCaptureConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";
import { Button } from "../ui/button";

export function ImageCaptureField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as ImageCaptureConfig | undefined;
  const inputRef = useRef<HTMLInputElement>(null);
  const imageUrl = value as string | undefined;
  const allowGallery = config?.allowGallery !== false;

  const handleFile = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
      onBlur();
    };
    reader.readAsDataURL(file);
  };

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex flex-col gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture={allowGallery ? undefined : (config?.camera === "front" ? "user" : "environment")}
          className="sr-only"
          disabled={disabled}
          onChange={(e) => handleFile(e.target.files)}
          aria-label={field.label}
        />

        {imageUrl ? (
          <div className="flex flex-col gap-2">
            <img src={imageUrl} alt="Captured" className="max-w-full rounded-md border border-input" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onChange(undefined)}
              disabled={disabled}
            >
              Remove
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
          >
            {allowGallery ? "Take photo or choose from gallery" : "Take photo"}
          </Button>
        )}
      </div>
    </FieldWrapper>
  );
}
