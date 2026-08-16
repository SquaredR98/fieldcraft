/**
 * Analytics event emitter for FieldCraft forms.
 *
 * @description Provides a unified event system for tracking form interactions.
 * Events are emitted via the `onEvent` callback in {@link EngineOptions}.
 * All events carry a timestamp and the schema ID for correlation.
 *
 * @example
 * ```typescript
 * const engine = createEngine(schema, {
 *   onEvent: (event) => {
 *     // Forward to Google Analytics, Segment, Mixpanel, etc.
 *     gtag("event", event.type, event);
 *   },
 * });
 * ```
 *
 * @module analytics-emitter
 * @since 1.4.0
 */

/**
 * Discriminated union of all analytics event types emitted by the engine.
 */
export type FieldCraftEvent =
  | { type: "fc_form_view"; schemaId: string; timestamp: number }
  | { type: "fc_form_start"; schemaId: string; timestamp: number; fieldId: string }
  | { type: "fc_field_focus"; schemaId: string; timestamp: number; fieldId: string }
  | { type: "fc_field_complete"; schemaId: string; timestamp: number; fieldId: string; durationMs?: number }
  | { type: "fc_section_complete"; schemaId: string; timestamp: number; sectionId: string; sectionIndex: number }
  | { type: "fc_form_submit"; schemaId: string; timestamp: number; completionTimeMs: number; fieldCount: number }
  | { type: "fc_form_abandon"; schemaId: string; timestamp: number; lastSectionId: string; completedFieldCount: number }
  | { type: "fc_validation_error"; schemaId: string; timestamp: number; fieldId: string; errorCount: number }
  | { type: "fc_draft_save"; schemaId: string; timestamp: number }
  | { type: "fc_draft_resume"; schemaId: string; timestamp: number };

/**
 * Callback type for receiving analytics events.
 */
export type OnEventCallback = (event: FieldCraftEvent) => void;

/**
 * Creates an analytics emitter bound to a specific schema.
 * The emitter provides typed helper methods for emitting each event type.
 *
 * @param schemaId - The schema ID to include in all events.
 * @param onEvent - The callback to invoke for each event.
 * @returns An emitter object with methods for each event type.
 */
export function createAnalyticsEmitter(schemaId: string, onEvent?: OnEventCallback) {
  if (!onEvent) {
    // Return no-op emitter when analytics is disabled
    return {
      formView: () => {},
      formStart: (_fieldId: string) => {},
      fieldFocus: (_fieldId: string) => {},
      fieldComplete: (_fieldId: string, _durationMs?: number) => {},
      sectionComplete: (_sectionId: string, _sectionIndex: number) => {},
      formSubmit: (_completionTimeMs: number, _fieldCount: number) => {},
      formAbandon: (_lastSectionId: string, _completedFieldCount: number) => {},
      validationError: (_fieldId: string, _errorCount: number) => {},
      draftSave: () => {},
      draftResume: () => {},
    };
  }

  return {
    formView() {
      onEvent({ type: "fc_form_view", schemaId, timestamp: Date.now() });
    },

    formStart(fieldId: string) {
      onEvent({ type: "fc_form_start", schemaId, timestamp: Date.now(), fieldId });
    },

    fieldFocus(fieldId: string) {
      onEvent({ type: "fc_field_focus", schemaId, timestamp: Date.now(), fieldId });
    },

    fieldComplete(fieldId: string, durationMs?: number) {
      onEvent({ type: "fc_field_complete", schemaId, timestamp: Date.now(), fieldId, durationMs });
    },

    sectionComplete(sectionId: string, sectionIndex: number) {
      onEvent({ type: "fc_section_complete", schemaId, timestamp: Date.now(), sectionId, sectionIndex });
    },

    formSubmit(completionTimeMs: number, fieldCount: number) {
      onEvent({ type: "fc_form_submit", schemaId, timestamp: Date.now(), completionTimeMs, fieldCount });
    },

    formAbandon(lastSectionId: string, completedFieldCount: number) {
      onEvent({ type: "fc_form_abandon", schemaId, timestamp: Date.now(), lastSectionId, completedFieldCount });
    },

    validationError(fieldId: string, errorCount: number) {
      onEvent({ type: "fc_validation_error", schemaId, timestamp: Date.now(), fieldId, errorCount });
    },

    draftSave() {
      onEvent({ type: "fc_draft_save", schemaId, timestamp: Date.now() });
    },

    draftResume() {
      onEvent({ type: "fc_draft_resume", schemaId, timestamp: Date.now() });
    },
  };
}
