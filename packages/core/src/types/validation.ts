/**
 * Discriminated union of all built-in validation rule types.
 *
 * @description Each rule has a `type` discriminator and type-specific properties.
 * All rules accept an optional `message` override — if omitted, the engine provides
 * a sensible default error message.
 *
 * @example
 * ```typescript
 * const rules: ValidationRule[] = [
 *   { type: "required" },
 *   { type: "minLength", value: 3, message: "Too short" },
 *   { type: "pattern", regex: "^[A-Z]", message: "Must start with uppercase" },
 *   { type: "custom", name: "uniqueEmail" },
 * ];
 * ```
 *
 * @since 1.0.0
 */
export type ValidationRule =
  | { type: "required"; message?: string }
  | { type: "min"; value: number; message?: string }
  | { type: "max"; value: number; message?: string }
  | { type: "minLength"; value: number; message?: string }
  | { type: "maxLength"; value: number; message?: string }
  | { type: "pattern"; regex: string; flags?: string; message?: string }
  | { type: "email"; message?: string }
  | { type: "phone"; message?: string }
  | { type: "url"; message?: string }
  | { type: "date"; min?: string; max?: string; message?: string }
  | { type: "fileSize"; maxMb: number; message?: string }
  | { type: "fileType"; accept: string[]; message?: string }
  | { type: "custom"; name: string; params?: Record<string, unknown>; message?: string }
  | { type: "async"; endpoint: string; debounceMs?: number; message?: string };

/**
 * Signature for custom synchronous validators registered via `ValidatorRegistry`.
 *
 * @param value - The current field value being validated.
 * @param values - All current form values (for cross-field validation).
 * @param params - Optional parameters passed from the validation rule's `params` property.
 * @returns An error message string if validation fails, or `null` if valid.
 *
 * @example
 * ```typescript
 * const passwordMatch: CustomValidator = (value, values) => {
 *   if (value !== values.password) return "Passwords do not match";
 *   return null;
 * };
 * ```
 *
 * @since 1.0.0
 */
export type CustomValidator = (
  value: unknown,
  values: Record<string, unknown>,
  params?: Record<string, unknown>,
) => string | null;

/**
 * Signature for asynchronous validators (e.g., server-side uniqueness checks).
 *
 * @param value - The current field value being validated.
 * @param params - Optional parameters from the validation rule.
 * @returns A Promise resolving to an error message string or `null`.
 *
 * @since 1.2.0
 */
export type AsyncValidator = (
  value: unknown,
  params?: Record<string, unknown>,
) => Promise<string | null>;
