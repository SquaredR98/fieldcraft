import { useRef, useEffect, useCallback } from "react";
import type { SignatureConfig } from "@squaredr/fieldcraft-core";
import type { FieldProps } from "../../registry/field-registry";
import { FieldWrapper } from "./FieldWrapper";

export function SignatureField({ field, value, error, touched, disabled, onChange, onBlur }: FieldProps) {
  const config = field.config as SignatureConfig | undefined;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const width = config?.width ?? 400;
  const height = config?.height ?? 200;

  // Restore signature from data URL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !value) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.src = value as string;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startDraw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (disabled) return;
      drawingRef.current = true;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      const point = "touches" in e ? e.touches[0] : e;
      ctx.beginPath();
      ctx.moveTo(point.clientX - rect.left, point.clientY - rect.top);
    },
    [disabled],
  );

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!drawingRef.current || disabled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      const point = "touches" in e ? e.touches[0] : e;
      ctx.strokeStyle = config?.penColor ?? "#000000";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineTo(point.clientX - rect.left, point.clientY - rect.top);
      ctx.stroke();
    },
    [config?.penColor, disabled],
  );

  const endDraw = useCallback(() => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    onChange(canvas.toDataURL("image/png"));
    onBlur();
  }, [onChange, onBlur]);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    onChange(undefined);
  }, [width, height, onChange]);

  return (
    <FieldWrapper field={field} error={error} touched={touched}>
      <div className="flex flex-col gap-2">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="rounded-md border border-input cursor-crosshair touch-none"
          style={{ backgroundColor: config?.backgroundColor ?? "#ffffff" }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
          aria-label={`${field.label} signature pad`}
          role="img"
        />
        <button
          type="button"
          className="self-end text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          onClick={clear}
          disabled={disabled}
        >
          Clear
        </button>
      </div>
    </FieldWrapper>
  );
}
