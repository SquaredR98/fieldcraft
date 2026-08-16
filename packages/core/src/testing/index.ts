/**
 * @squaredr/fieldcraft-core/testing
 *
 * Subpath export for testing utilities. Provides helpers for creating
 * minimal schemas, mock adapters, and test assertions.
 *
 * @example
 * ```typescript
 * import { createTestSchema, createMockAdapter } from "@squaredr/fieldcraft-core/testing";
 * ```
 *
 * @module testing
 * @since 1.4.0
 */

import type { FormEngineSchema, Question, Section } from "../types/schema";
import type { SubmitAdapter, DraftAdapter } from "../types/adapters";

/**
 * Creates a minimal valid schema for testing purposes.
 *
 * @param overrides - Partial schema properties to merge.
 * @returns A valid FormEngineSchema.
 */
export function createTestSchema(overrides?: Partial<FormEngineSchema>): FormEngineSchema {
  return {
    id: "test-form",
    version: "1.0.0",
    title: "Test Form",
    sections: [
      {
        id: "section-1",
        title: "Section 1",
        questions: [
          { id: "field-1", type: "short_text", label: "Field 1" },
        ],
      },
    ],
    submitAction: { type: "callback" },
    ...overrides,
  };
}

/**
 * Creates a test section with optional questions.
 *
 * @param id - Section ID.
 * @param questions - Optional array of questions.
 * @returns A Section object.
 */
export function createTestSection(id: string, questions?: Question[]): Section {
  return {
    id,
    title: `Section ${id}`,
    questions: questions ?? [
      { id: `${id}-field`, type: "short_text", label: `Field in ${id}` },
    ],
  };
}

/**
 * Creates a test question with optional overrides.
 *
 * @param id - Question ID.
 * @param overrides - Partial question properties.
 * @returns A Question object.
 */
export function createTestQuestion(id: string, overrides?: Partial<Question>): Question {
  return {
    id,
    type: "short_text",
    label: `Question ${id}`,
    ...overrides,
  };
}

/**
 * Creates a mock SubmitAdapter for testing.
 *
 * @param overrides - Override default mock implementations.
 * @returns A mock SubmitAdapter.
 */
export function createMockSubmitAdapter(overrides?: Partial<SubmitAdapter>): SubmitAdapter {
  return {
    name: "mock-adapter",
    submit: async () => {},
    ...overrides,
  };
}

/**
 * Creates a mock DraftAdapter for testing.
 *
 * @param overrides - Override default mock implementations.
 * @returns A mock DraftAdapter.
 */
export function createMockDraftAdapter(overrides?: Partial<DraftAdapter>): DraftAdapter {
  return {
    save: async () => {},
    load: async () => null,
    delete: async () => {},
    ...overrides,
  };
}
