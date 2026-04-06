import type { CustomValidator, AsyncValidator } from "../types/validation";

/**
 * Registry for custom and async validators.
 * Custom validators are registered by name and referenced in schema validation rules.
 */
export type ValidatorRegistry = {
  registerCustom(name: string, validator: CustomValidator): void;
  registerAsync(name: string, validator: AsyncValidator): void;
  getCustom(name: string): CustomValidator | undefined;
  getAsync(name: string): AsyncValidator | undefined;
};

export function createValidatorRegistry(
  customValidators?: Record<string, CustomValidator>,
  asyncValidators?: Record<string, AsyncValidator>,
): ValidatorRegistry {
  const customs = new Map<string, CustomValidator>(
    customValidators ? Object.entries(customValidators) : [],
  );
  const asyncs = new Map<string, AsyncValidator>(
    asyncValidators ? Object.entries(asyncValidators) : [],
  );

  return {
    registerCustom(name, validator) {
      customs.set(name, validator);
    },
    registerAsync(name, validator) {
      asyncs.set(name, validator);
    },
    getCustom(name) {
      return customs.get(name);
    },
    getAsync(name) {
      return asyncs.get(name);
    },
  };
}
