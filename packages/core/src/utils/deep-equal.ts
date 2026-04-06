/**
 * Deep equality check for two values.
 * Used by the state manager to detect actual value changes and avoid unnecessary re-renders.
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;

  if (typeof a === "object") {
    const objA = a as Record<string, unknown>;
    const objB = b as Record<string, unknown>;

    if (Array.isArray(objA) !== Array.isArray(objB)) return false;

    if (Array.isArray(objA) && Array.isArray(objB)) {
      if (objA.length !== objB.length) return false;
      return objA.every((item, index) => deepEqual(item, objB[index]));
    }

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;

    return keysA.every((key) => deepEqual(objA[key], objB[key]));
  }

  return false;
}
