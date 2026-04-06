import type { ValidationRule } from "../types/validation";

/**
 * Run a single built-in validation rule against a value.
 * Returns an error message string if validation fails, or null if it passes.
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

function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || value === "" ||
    (Array.isArray(value) && value.length === 0);
}

function validateRequired(value: unknown, message?: string): string | null {
  if (isEmpty(value)) {
    return message ?? "This field is required";
  }
  if (typeof value === "boolean") return null; // false is a valid boolean answer
  return null;
}

function validateMin(value: unknown, min: number, message?: string): string | null {
  if (isEmpty(value)) return null; // Don't validate empty (use "required" for that)
  const num = Number(value);
  if (isNaN(num)) return null;
  if (num < min) {
    return message ?? `Must be at least ${min}`;
  }
  return null;
}

function validateMax(value: unknown, max: number, message?: string): string | null {
  if (isEmpty(value)) return null;
  const num = Number(value);
  if (isNaN(num)) return null;
  if (num > max) {
    return message ?? `Must be at most ${max}`;
  }
  return null;
}

function validateMinLength(value: unknown, minLen: number, message?: string): string | null {
  if (isEmpty(value)) return null;
  const str = String(value);
  if (str.length < minLen) {
    return message ?? `Must be at least ${minLen} characters`;
  }
  return null;
}

function validateMaxLength(value: unknown, maxLen: number, message?: string): string | null {
  if (isEmpty(value)) return null;
  const str = String(value);
  if (str.length > maxLen) {
    return message ?? `Must be at most ${maxLen} characters`;
  }
  return null;
}

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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value: unknown, message?: string): string | null {
  if (isEmpty(value)) return null;
  if (!EMAIL_REGEX.test(String(value))) {
    return message ?? "Please enter a valid email address";
  }
  return null;
}

// Accepts common phone formats: digits, spaces, dashes, parens, plus sign
const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/;

function validatePhone(value: unknown, message?: string): string | null {
  if (isEmpty(value)) return null;
  if (!PHONE_REGEX.test(String(value))) {
    return message ?? "Please enter a valid phone number";
  }
  return null;
}

function validateUrl(value: unknown, message?: string): string | null {
  if (isEmpty(value)) return null;
  try {
    new URL(String(value));
  } catch {
    return message ?? "Please enter a valid URL";
  }
  return null;
}

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

function validateFileSize(value: unknown, maxMb: number, message?: string): string | null {
  if (isEmpty(value)) return null;
  // Value is expected to be a File object or an object with a size property (bytes)
  const file = value as { size?: number };
  if (file.size !== undefined) {
    const mb = file.size / (1024 * 1024);
    if (mb > maxMb) {
      return message ?? `File must be smaller than ${maxMb}MB`;
    }
  }
  return null;
}

function validateFileType(value: unknown, accept: string[], message?: string): string | null {
  if (isEmpty(value)) return null;
  // Value is expected to be a File object or an object with a type property
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
