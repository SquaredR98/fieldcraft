/**
 * @squaredr/fieldcraft-core/validators
 *
 * Subpath export for direct access to validator utilities.
 *
 * @example
 * ```typescript
 * import { runBuiltInRule, createValidatorRegistry } from "@squaredr/fieldcraft-core/validators";
 * ```
 *
 * @module validators
 * @since 1.4.0
 */

export { runBuiltInRule } from "./built-in";
export { createValidatorRegistry } from "./registry";
export type { ValidatorRegistry, ValidatorMetadata } from "./registry";
export type { ValidationRule, CustomValidator, AsyncValidator } from "../types/validation";
