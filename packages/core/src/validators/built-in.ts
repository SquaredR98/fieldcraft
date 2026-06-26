import type { ValidationRule } from "../types/validation";

/**
 * Executes a single built-in validation rule against a field value.
 *
 * This is the core dispatcher for FieldCraft's 12 built-in validators.
 * Each rule type maps to a focused validator function. Rules with
 * `type: "custom"` or `type: "async"` are handled by the validation
 * runner, not here — this function returns `null` for those.
 *
 * All validators (except `required`) return `null` for empty values,
 * following the convention that emptiness is only an error when
 * `{ type: "required" }` is explicitly present.
 *
 * @param rule - The validation rule from the schema (e.g., `{ type: "email" }` or `{ type: "min", value: 0 }`).
 * @param value - The current field value to validate.
 * @param _allValues - All form values (reserved for cross-field validation; unused by built-in rules).
 * @returns An error message string if validation fails, or `null` if it passes.
 *
 * @example
 * ```typescript
 * runBuiltInRule({ type: "required" }, "");          // "This field is required"
 * runBuiltInRule({ type: "required" }, "hello");     // null
 * runBuiltInRule({ type: "email" }, "bad");          // "Please enter a valid email address"
 * runBuiltInRule({ type: "min", value: 5 }, 3);      // "Must be at least 5"
 * runBuiltInRule({ type: "custom", name: "x" }, ""); // null (handled elsewhere)
 * ```
 *
 * @since 1.0.0
 */
export function runBuiltInRule(
  rule: ValidationRule,
  value: unknown,
  _allValues?: Record<string, unknown>,
): string | null {
  switch (rule.type) {
    case "required":
      return validateRequired(value, rule.message);

    case "min":
      return validateMin(value, rule.value, rule.message);

    case "max":
      return validateMax(value, rule.value, rule.message);

    case "minLength":
      return validateMinLength(value, rule.value, rule.message);

    case "maxLength":
      return validateMaxLength(value, rule.value, rule.message);

    case "pattern":
      return validatePattern(value, rule.regex, rule.flags, rule.message);

    case "email":
      return validateEmail(value, rule.message);

    case "phone":
      return validatePhone(value, rule.message);

    case "url":
      return validateUrl(value, rule.message);

    case "date":
      return validateDate(value, rule.min, rule.max, rule.message);

    case "fileSize":
      return validateFileSize(value, rule.maxMb, rule.message);

    case "fileType":
      return validateFileType(value, rule.accept, rule.message);

    // Custom and async validators are handled by the validation runner, not here
    case "custom":
    case "async":
      return null;

    default:
      return null;
  }
}

// ---- Individual validators ----

/**
 * Checks if a value is considered "empty" for validation purposes.
 * Empty values: `undefined`, `null`, `""` (empty string), `[]` (empty array).
 *
 * All validators except `required` skip empty values — emptiness is only
 * an error when `{ type: "required" }` is explicitly present in the rules.
 */
function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || value === "" ||
    (Array.isArray(value) && value.length === 0);
}

/**
 * Validates that a field has a non-empty value.
 * Empty means: `undefined`, `null`, `""`, or `[]`.
 * `false` is considered a valid value (for boolean/checkbox fields).
 *
 * Schema usage: `{ type: "required" }`
 *
 * @param value - The field value.
 * @param message - Custom error message. Defaults to `"This field is required"`.
 * @since 1.0.0
 */
function validateRequired(value: unknown, message?: string): string | null {
  if (isEmpty(value)) {
    return message ?? "This field is required";
  }
  if (typeof value === "boolean") return null; // false is a valid boolean answer
  return null;
}

/**
 * Validates that a numeric value is greater than or equal to a minimum.
 * Non-numeric and empty values pass (combine with `required` for mandatory fields).
 *
 * Schema usage: `{ type: "min", value: 0 }`
 *
 * @param value - The field value (coerced to number via `Number()`).
 * @param min - The minimum allowed value (inclusive).
 * @param message - Custom error message. Defaults to `"Must be at least {min}"`.
 * @since 1.0.0
 */
function validateMin(value: unknown, min: number, message?: string): string | null {
  if (isEmpty(value)) return null; // Don't validate empty (use "required" for that)
  const num = Number(value);
  if (isNaN(num)) return null;
  if (num < min) {
    return message ?? `Must be at least ${min}`;
  }
  return null;
}

/**
 * Validates that a numeric value is less than or equal to a maximum.
 * Non-numeric and empty values pass.
 *
 * Schema usage: `{ type: "max", value: 100 }`
 *
 * @param value - The field value (coerced to number via `Number()`).
 * @param max - The maximum allowed value (inclusive).
 * @param message - Custom error message. Defaults to `"Must be at most {max}"`.
 * @since 1.0.0
 */
function validateMax(value: unknown, max: number, message?: string): string | null {
  if (isEmpty(value)) return null;
  const num = Number(value);
  if (isNaN(num)) return null;
  if (num > max) {
    return message ?? `Must be at most ${max}`;
  }
  return null;
}

/**
 * Validates that a string value meets a minimum character length.
 * Empty values pass.
 *
 * Schema usage: `{ type: "minLength", value: 3 }`
 *
 * @param value - The field value (coerced to string via `String()`).
 * @param minLen - The minimum number of characters required.
 * @param message - Custom error message. Defaults to `"Must be at least {minLen} characters"`.
 * @since 1.0.0
 */
function validateMinLength(value: unknown, minLen: number, message?: string): string | null {
  if (isEmpty(value)) return null;
  const str = String(value);
  if (str.length < minLen) {
    return message ?? `Must be at least ${minLen} characters`;
  }
  return null;
}

/**
 * Validates that a string value does not exceed a maximum character length.
 * Empty values pass.
 *
 * Schema usage: `{ type: "maxLength", value: 500 }`
 *
 * @param value - The field value (coerced to string via `String()`).
 * @param maxLen - The maximum number of characters allowed.
 * @param message - Custom error message. Defaults to `"Must be at most {maxLen} characters"`.
 * @since 1.0.0
 */
function validateMaxLength(value: unknown, maxLen: number, message?: string): string | null {
  if (isEmpty(value)) return null;
  const str = String(value);
  if (str.length > maxLen) {
    return message ?? `Must be at most ${maxLen} characters`;
  }
  return null;
}

/**
 * Validates that a string value matches a regular expression pattern.
 * Empty values pass. Invalid regex patterns are treated as validation failures.
 *
 * Schema usage: `{ type: "pattern", regex: "^[A-Z]{2}\\d{4}$", flags: "i" }`
 *
 * @param value - The field value (coerced to string via `String()`).
 * @param regex - The regular expression pattern string.
 * @param flags - Optional regex flags (e.g., `"i"` for case-insensitive).
 * @param message - Custom error message. Defaults to `"Invalid format"`.
 * @since 1.0.0
 */
function validatePattern(
  value: unknown,
  regex: string,
  flags?: string,
  message?: string,
): string | null {
  if (isEmpty(value)) return null;
  try {
    const re = new RegExp(regex, flags);
    if (!re.test(String(value))) {
      return message ?? "Invalid format";
    }
  } catch {
    return message ?? "Invalid format";
  }
  return null;
}

/**
 * Email regex: requires `local@domain.tld` where TLD is at least 2 characters.
 * Rejects single-char TLDs like `user@example.c` while accepting `user@example.co`.
 *
 * @since 1.3.6 — Updated from `{1,}` to `{2,}` for TLD check.
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Validates that a value is a well-formed email address.
 * Uses a practical regex that catches common mistakes without
 * over-rejecting valid addresses.
 *
 * Schema usage: `{ type: "email" }`
 *
 * @param value - The field value (coerced to string).
 * @param message - Custom error message. Defaults to `"Please enter a valid email address"`.
 * @since 1.0.0
 */
function validateEmail(value: unknown, message?: string): string | null {
  if (isEmpty(value)) return null;
  if (!EMAIL_REGEX.test(String(value))) {
    return message ?? "Please enter a valid email address";
  }
  return null;
}

/**
 * Phone regex: accepts common international formats.
 * Allows: digits, spaces, dashes, parentheses, and leading `+`.
 * Requires 7–20 characters.
 */
const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/;

/**
 * Validates that a value is a plausible phone number.
 * Accepts international formats with `+`, parentheses, dashes, and spaces.
 *
 * Schema usage: `{ type: "phone" }`
 *
 * @param value - The field value (coerced to string).
 * @param message - Custom error message. Defaults to `"Please enter a valid phone number"`.
 * @since 1.0.0
 */
function validatePhone(value: unknown, message?: string): string | null {
  if (isEmpty(value)) return null;
  if (!PHONE_REGEX.test(String(value))) {
    return message ?? "Please enter a valid phone number";
  }
  return null;
}

/**
 * Validates that a value is a well-formed URL using the native `URL` constructor.
 * Requires a protocol (e.g., `https://example.com`).
 *
 * Schema usage: `{ type: "url" }`
 *
 * @param value - The field value (coerced to string).
 * @param message - Custom error message. Defaults to `"Please enter a valid URL"`.
 * @since 1.0.0
 */
function validateUrl(value: unknown, message?: string): string | null {
  if (isEmpty(value)) return null;
  try {
    new URL(String(value));
  } catch {
    return message ?? "Please enter a valid URL";
  }
  return null;
}

/**
 * Validates that a value is a valid date, optionally within a min/max range.
 * Parses via `new Date()`. Range boundaries are ISO date strings (e.g., `"2024-01-01"`).
 *
 * Schema usage: `{ type: "date", min: "2024-01-01", max: "2025-12-31" }`
 *
 * @param value - The field value (coerced to string, then parsed as a Date).
 * @param min - Optional earliest allowed date (ISO string, inclusive).
 * @param max - Optional latest allowed date (ISO string, inclusive).
 * @param message - Custom error message.
 * @since 1.0.0
 */
function validateDate(
  value: unknown,
  min?: string,
  max?: string,
  message?: string,
): string | null {
  if (isEmpty(value)) return null;
  const date = new Date(String(value));
  if (isNaN(date.getTime())) {
    return message ?? "Please enter a valid date";
  }
  if (min) {
    const minDate = new Date(min);
    if (date < minDate) {
      return message ?? `Date must be after ${min}`;
    }
  }
  if (max) {
    const maxDate = new Date(max);
    if (date > maxDate) {
      return message ?? `Date must be before ${max}`;
    }
  }
  return null;
}

/**
 * Validates that a file's size does not exceed a maximum in megabytes.
 * Expects the value to be a `File` object or any object with a `size` property (in bytes).
 *
 * Schema usage: `{ type: "fileSize", maxMb: 10 }`
 *
 * @param value - A File object or `{ size: number }`.
 * @param maxMb - Maximum file size in megabytes.
 * @param message - Custom error message. Defaults to `"File must be smaller than {maxMb}MB"`.
 * @since 1.0.0
 */
function validateFileSize(value: unknown, maxMb: number, message?: string): string | null {
  if (isEmpty(value)) return null;
  const file = value as { size?: number };
  if (file.size !== undefined) {
    const mb = file.size / (1024 * 1024);
    if (mb > maxMb) {
      return message ?? `File must be smaller than ${maxMb}MB`;
    }
  }
  return null;
}

/**
 * Validates that a file's MIME type matches one of the accepted patterns.
 * Supports exact types (`"application/pdf"`) and wildcards (`"image/*"`).
 * Expects the value to be a `File` object or any object with a `type` property.
 *
 * Schema usage: `{ type: "fileType", accept: ["image/*", "application/pdf"] }`
 *
 * @param value - A File object or `{ type: string }`.
 * @param accept - Array of accepted MIME types or wildcard patterns.
 * @param message - Custom error message. Defaults to `"File type must be one of: {accept}"`.
 * @since 1.0.0
 */
function validateFileType(value: unknown, accept: string[], message?: string): string | null {
  if (isEmpty(value)) return null;
  const file = value as { type?: string; name?: string };
  if (file.type) {
    const matches = accept.some((pattern) => {
      if (pattern.endsWith("/*")) {
        // Wildcard: "image/*" matches "image/png"
        const prefix = pattern.slice(0, -1);
        return file.type!.startsWith(prefix);
      }
      return file.type === pattern;
    });
    if (!matches) {
      return message ?? `File type must be one of: ${accept.join(", ")}`;
    }
  }
  return null;
}
