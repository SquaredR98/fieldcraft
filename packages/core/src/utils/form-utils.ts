/**
 * Flattens nested form values into dot-notation keys.
 *
 * @example
 * ```typescript
 * flattenFormValues({ address: { city: "NYC", zip: "10001" } });
 * // { "address.city": "NYC", "address.zip": "10001" }
 * ```
 *
 * @param values - Nested form values.
 * @returns Flat key-value object with dot-notation keys.
 * @since 1.4.0
 */
export function flattenFormValues(
  values: Record<string, unknown>,
  prefix = "",
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(values)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenFormValues(value as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = value;
    }
  }

  return result;
}

/**
 * Unflattens dot-notation keys back into nested objects.
 *
 * @example
 * ```typescript
 * unflattenFormValues({ "address.city": "NYC", "address.zip": "10001" });
 * // { address: { city: "NYC", zip: "10001" } }
 * ```
 *
 * @param flat - Flat key-value object with dot-notation keys.
 * @returns Nested object.
 * @since 1.4.0
 */
export function unflattenFormValues(flat: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split(".");
    let current = result;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current) || typeof current[part] !== "object" || current[part] === null) {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }

    current[parts[parts.length - 1]] = value;
  }

  return result;
}
